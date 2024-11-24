import { Hono } from "hono";
import { validator } from "hono/validator";
import { Illust, Ugoira, User, Rank } from "../models/db";
import {
  fetchIllust,
  fetchUgoira,
  fetchUser,
  fetchUserIllusts,
} from "../fetch";
import {
  fromPixivIllust,
  fromPixivUser,
  fromPixivUserIllusts,
  ok,
  error,
  toIllustResponse,
  toUserIllustsResponse,
  toUserResponse,
  fromPixivUgoira,
  toUgoiraResponse,
  toIllustsResponse,
  toIllustSearch,
  toUserSearch,
  toUsersReponse,
} from "../common/conversion";
import {
  PAGE_LIMIT,
  RANK_CONTENTS,
  RANK_MODES,
  Errors,
  CONCURRENCY,
} from "../models/const";
import PromisePool from "../utils/pool";
import { connections } from "../utils/connect";
import { filter } from "../utils/filter";
import { set } from "mongoose";

const workingTasks = {
  userIllusts: new Set<any>(),
}

const pageValidator = validator("query", (value, c) => {
  const page = value["page"];
  if (!page || typeof page !== "string") {
    return { page: 0 };
  }
  try {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 0) {
      return { page: 0 };
    }
    return { page: pageNum };
  } catch {
    return { page: 0 };
  }
});

const queryFilter = validator("param", (value, c) => {
  const query = value["query"];
  if (!query || typeof query !== "string") {
    return c.json(error(Errors.InvalidRequest), 500);
  }
  if (filter.check(query)) {
    return c.json(error(Errors.Banned), 500);
  }
  return { query: query };
});
const app = new Hono();

app.get("/illust/:id", async (c) => {
  const { id } = c.req.param();
  let illust = await Illust.findById(id);
  if (!illust) {
    const fetchedIllust = await fetchIllust(id);
    if (!fetchedIllust) {
      return c.json(error(Errors.TryInFewMinutes), 500);
    }
    illust = fromPixivIllust(fetchedIllust);
    await illust.save();
    await connections.meli
      ?.index("illusts")
      ?.addDocuments([toIllustSearch(illust)]);
  }
  if (illust.banned) return c.json(error(Errors.Banned), 500);
  const response = toIllustResponse(illust);
  return c.json(ok(response));
});

app.get("/illust/:id/ugoira", async (c) => {
  const { id } = c.req.param();
  let ugoira = await Ugoira.findById(id);
  if (!ugoira) {
    const fetchedUgoira = await fetchUgoira(id);
    if (!fetchedUgoira) {
      return c.json(error(Errors.TryInFewMinutes), 500);
    }
    ugoira = fromPixivUgoira(fetchedUgoira, parseInt(id));
    await ugoira.save();
  }
  const response = toUgoiraResponse(ugoira);
  return c.json(ok(response));
});

app.get("/illustrator/:id", async (c) => {
  const { id } = c.req.param();
  let user = await User.findById(id);
  if (!user) {
    const fetchedUser = await fetchUser(id);
    if (!fetchedUser) {
      return c.json(error(Errors.TryInFewMinutes), 500);
    }
    user = fromPixivUser(fetchedUser);
    await user.save();
    await connections.meli?.index("users")?.addDocuments([toUserSearch(user)]);
  }
  if (user.banned) return c.json(error(Errors.Banned), 500);
  const response = toUserResponse(user);
  return c.json(ok(response));
});

app.get("/illustrator/:id/illusts", pageValidator, async (c) => {
  const { id } = c.req.param();
  const { page } = c.req.valid("query");

  let user = await User.findById(id);
  if (!user) {
    const fetchedUser = await fetchUser(id);
    if (!fetchedUser) {
      return c.json(error(Errors.TryInFewMinutes), 500);
    }
    user = fromPixivUser(fetchedUser);
    await user.save();
    await connections.meli?.index("users")?.addDocuments([toUserSearch(user)]);
  }
  if (
    (user.illusts_update_time?.getTime() ?? 0) + 172800000 <
    new Date().getTime()
  ) {
    if (workingTasks.userIllusts.size > 1) {
      return c.json(error(Errors.TryInFewMinutes), 500);
    }
    if (workingTasks.userIllusts.has(id)) {
      return c.json(error(Errors.TryInFewMinutes), 500);
    }
    
    const fetchedUserIllusts = await fetchUserIllusts(id);
    if (!fetchedUserIllusts) {
      return c.json(error(Errors.TryInFewMinutes), 500);
    }
    const fetchedUserIllustsRes = fromPixivUserIllusts(fetchedUserIllusts);
    workingTasks.userIllusts.add(id);
    const timeout = setTimeout(() => {
      workingTasks.userIllusts.delete(id);
    }, 120000);
    for (let illustId of fetchedUserIllustsRes) {
      if (!workingTasks.userIllusts.has(id)) {
        break;
      }
      const illust = await Illust.findById(illustId);
      if (!illust) {
        const fetchedIllust = await fetchIllust(illustId);
        await new Promise((resolve) => setTimeout(resolve, 200));
        if (!fetchedIllust) {
          workingTasks.userIllusts.delete(id);
          clearTimeout(timeout);
          return c.json(error(Errors.TryInFewMinutes), 500);
        }
        if (fetchedIllust.tags === undefined) {
          workingTasks.userIllusts.delete(id);
          clearTimeout(timeout);
          return c.json(error(Errors.TryInFewMinutes), 500);
        }
        const illust = fromPixivIllust(fetchedIllust);
        await illust.save();
        await connections.meli
          ?.index("illusts")
          ?.addDocuments([toIllustSearch(illust)]);
      }
    }
    workingTasks.userIllusts.delete(id);
    clearTimeout(timeout);
    user.illusts_update_time = new Date();
    await user.save();
  }
  const userResponse = toUserResponse(user);
  const illustsCountTotal = await Illust.countDocuments({ user: user._id });
  const illusts = await Illust.find({ user: user._id, banned: false })
    .sort({ createDate: -1 })
    .limit(PAGE_LIMIT)
    .skip(page * PAGE_LIMIT)
    .exec();
  const illustsResponse = illusts.map(toIllustResponse);
  const response = toUserIllustsResponse(
    illustsResponse,
    userResponse,
    illustsCountTotal > (page + 1) * PAGE_LIMIT
  );
  return c.json(ok(response));
});

app.get(
  "/rank",
  validator("query", (value, c) => {
    const mode = value["mode"];
    const date = value["date"];
    const content = value["content"];
    let page = value["page"];
    if (!page || typeof page !== "string") {
      return c.json(error(Errors.InvalidRequest), 500);
    }
    if (!mode || typeof mode !== "string") {
      return c.json(error(Errors.InvalidRequest), 500);
    }
    if (!date || typeof date !== "string") {
      return c.json(error(Errors.InvalidRequest), 500);
    }
    if (!content || typeof content !== "string") {
      return c.json(error(Errors.InvalidRequest), 500);
    }
    if (!RANK_CONTENTS.includes(content)) {
      return c.json(error(Errors.InvalidRequest), 500);
    }
    if (!RANK_MODES[content].includes(mode)) {
      return c.json(error(Errors.InvalidRequest), 500);
    }
    if (date.length !== 8) {
      return c.json(error(Errors.InvalidRequest), 500);
    }
    try {
      parseInt(date);
    } catch {
      return c.json(error(Errors.InvalidRequest), 500);
    }
    let pageNum = 0;
    try {
      pageNum = parseInt(page);
      if (isNaN(pageNum) || pageNum < 0) {
        return c.json(error(Errors.InvalidRequest), 500);
      }
    } catch {
      return c.json(error(Errors.InvalidRequest), 500);
    }
    return {
      mode: mode,
      date: date,
      content: content,
      page: pageNum,
    };
  }),
  async (c) => {
    const { mode, date, content, page } = c.req.valid("query");
    const rank = await Rank.aggregate([
      {
        $match: {
          date: date,
          mode: mode,
          content: content,
        },
      },
      {
        $unwind: {
          path: "$illusts",
        },
      },
      {
        $skip: page * PAGE_LIMIT,
      },
      {
        $limit: PAGE_LIMIT,
      },
      {
        $lookup: {
          from: "illusts",
          localField: "illusts.id",
          foreignField: "_id",
          as: "illusts",
        },
      },
      {
        $project: {
          content: { $arrayElemAt: ["$illusts", 0] },
          _id: 0,
        },
      },
    ]).exec();
    const illusts = rank.map((r) => r.content);
    if (illusts.length == 0) {
      return c.json(error(Errors.TryInFewMinutes), 500);
    }
    const illustsResponse = illusts.map(toIllustResponse);
    return c.json(
      ok(toIllustsResponse(illustsResponse, page < 9 && illusts.length > 0))
    );
  }
);

app.get(
  "/search/illust/:query",
  pageValidator,
  validator("query", (value, c) => {
    const sort = value["sort"];
    if (!sort || typeof sort !== "string") {
      return { sort: "relevent" };
    }
    if (sort == "relevent" || sort == "popular" || sort == "time") {
      return { sort: sort };
    }
  }),
  queryFilter,
  async (c) => {
    const { page, sort } = c.req.valid("query");
    const { query } = c.req.valid("param");
    const sortReq: string[] = [];
    if (sort === "time") {
      sortReq.push("createTime:desc");
    } else if (sort === "popular") {
      sortReq.push("popularity:desc");
    }
    const search = (await connections.meli?.index("illusts").search(query, {
      page: page + 1,
      limit: PAGE_LIMIT,
      filter: "banned = false",
      sort: sortReq,
    })) ?? { hits: [], totalPages: 0 };

    const ids = search.hits.map((hit) => hit.id);
    const illusts = await Illust.find({ _id: { $in: ids } }).exec();
    const projects: Record<string, number> = {};
    for (let i = 0; illusts.length > i; i++) {
      projects[illusts[i]._id ?? 0] = i;
    }
    const illustsSorted = ids.map((id) => illusts[projects[id]]);
    return c.json(
      ok(
        toIllustsResponse(
          illustsSorted.map(toIllustResponse),
          search.totalPages > page + 1
        )
      )
    );
  }
);

app.get("/search/illustrator/:query", pageValidator, queryFilter, async (c) => {
  const { page } = c.req.valid("query");
  const { query } = c.req.valid("param");
  const search = (await connections.meli?.index("users").search(query, {
    page: page + 1,
    limit: PAGE_LIMIT,
    filter: "banned = false",
  })) ?? { hits: [], totalPages: 0 };

  const ids = search.hits.map((hit) => hit.id);
  const users = await User.find({ _id: { $in: ids } }).exec();
  const projects: Record<string, number> = {};
  for (let i = 0; users.length > i; i++) {
    projects[users[i]._id ?? 0] = i;
  }
  const usersSorted = ids.map((id) => users[projects[id]]);
  return c.json(
    ok(
      toUsersReponse(
        usersSorted.map(toUserResponse),
        search.totalPages > page + 1
      )
    )
  );
});

app.get("/illust/:id/recommend", pageValidator, async (c) => {
  const { page } = c.req.valid("query");
  const { id } = c.req.param();
  let illust = await Illust.findById(id);
  if (!illust) {
    const fetchedIllust = await fetchIllust(id);
    if (!fetchedIllust) {
      return c.json(error(Errors.TryInFewMinutes), 500);
    }
    illust = fromPixivIllust(fetchedIllust);
    await illust.save();
    await connections.meli
      ?.index("illusts")
      ?.addDocuments([toIllustSearch(illust)]);
  }
  if (illust.banned) return c.json(error(Errors.Banned), 500);
  const tags = illust?.tags.map((tag) => tag.name ?? "") ?? [];

  const search = (await connections.meli
    ?.index("illusts")
    .search(tags.join(", "), {
      page: page + 1,
      limit: PAGE_LIMIT,
      filter: "banned = false",
      /*hybrid: {
        semanticRatio: 1,
        embedder: "default",
      },*/
    })) ?? { hits: [], totalPages: 0 };

  const ids = search.hits.map((hit) => hit.id).filter((id) => id !== illust?._id);
  const illusts = await Illust.find({ _id: { $in: ids } }).exec();
  const projects: Record<string, number> = {};
  for (let i = 0; illusts.length > i; i++) {
    projects[illusts[i]._id ?? 0] = i;
  }

  const illustsSorted = ids.map((id) => illusts[projects[id]]);
  return c.json(
    ok(
      toIllustsResponse(
        illustsSorted.map(toIllustResponse),
        search.totalPages > page + 1
      )
    )
  );
});

export default app;
