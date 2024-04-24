import { toIllustSearch, toUserSearch } from "../common/conversion";
import { Illust, User } from "../models/db";
import { connections } from "../utils/connect";

export const syncronizeIllusts = async () => {
    const cursor = await Illust.find().cursor()
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        await connections.meli?.index("illusts").updateDocuments([toIllustSearch(doc)])
    }
    console.log("Syncronized")
}

export const syncronizeUsers = async () => {
    const cursor = await User.find().cursor()
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        await connections.meli?.index("users").updateDocuments([toUserSearch(doc)])
    }
    console.log("Syncronized")
}