import { fromPixivIllust, toIllustSearch } from "../common/conversion";
import { fetchRank, fetchIllust } from "../fetch";
import { RANK_MODES, RANK_CONTENTS, CONCURRENCY } from "../models/const"
import { Illust, Rank } from "../models/db";
import { connections } from "../utils/connect";
import PromisePool from "../utils/pool";

export const runRankTask = async (inputDate: string | null) => {
    const dateNow = new Date()
    dateNow.setDate(dateNow.getDate()-2)
    const date = inputDate ? inputDate : dateNow.toISOString().slice(0, 10).replace(/-/g, "");
    for (let content of RANK_CONTENTS) {
        for (let mode of RANK_MODES[content]) {
            const illusts = []
            let ranked = 0
            let page = 1
            while (true) {
                const rank = await fetchRank(mode, page, date, content)
                const illustIds = rank.contents.map(content => content.illust_id)
                for (let illustId of illustIds) {
                    const illust = await Illust.findById(illustId);
                      if (!illust) {
                        const fetchedIllust = await fetchIllust(illustId.toString());
                        const illust = fromPixivIllust(fetchedIllust);
                        await illust.save();
                        await connections.meli?.index("illusts").addDocuments([toIllustSearch(illust)]);
                      }
                    illusts.push({
                        id: illustId,
                        rank: ranked
                    })
                    ranked += 1
                }
                if (rank.next === false) {
                    break
                }
                page = rank.next as number
            }
            try {
                const rankDB = new Rank({
                    date,
                    mode,
                    content,
                    illusts: illusts
                })
                await rankDB.save()
            } catch (error) {
                console.log(error)
            }
        }
    }
    
}