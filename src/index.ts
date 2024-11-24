Date.prototype.getTimezoneOffset = function () {
  return 0;
};

import { Hono } from "hono";
import v3 from "./router/v3";
import { cors } from "hono/cors";
import { connectMongo, connectMeliSearch } from "./utils/connect";
import { initSearch } from "./models/search";
import { config, readConfig } from "./models/config";
import { loadFilter } from "./utils/filter";
import { runRankTask } from "./tasks/rank";

type PromiseState =
  | 'pending'
  | 'fulfilled'
  | 'rejected';

export async function getPromiseState(p: Promise<any>): Promise<PromiseState> {
  return await Promise.race([Promise.resolve(p).then((): PromiseState => 'fulfilled', (): PromiseState => 'rejected'), Promise.resolve().then((): PromiseState => 'pending')]);
}

const backgroundTasks: Map<String, Promise<any>> = new Map();

(async () => {
  await readConfig("config.json");
  await connectMongo();
  await connectMeliSearch();
  await initSearch();
  await loadFilter();

  console.log("app inited")
  const app = new Hono({});
  app.use(
    "*",
    cors({
      origin: config.server.cors,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  );
  app.route("/v3", v3);
  app.post("/admin/run/rank", async (c) => {
    if (backgroundTasks.has("rank")) {
      const state = await getPromiseState(backgroundTasks.get("rank")!!);
      if (state == 'fulfilled' || state == 'rejected') {
        backgroundTasks.delete("rank")
      }
      return c.json({
        "status": state
      })
    }
    backgroundTasks.set("rank", runRankTask(null));

    return c.json({
      "status": "starting"
    });
  })

  app.get("/announce/fetch/pixivel", async (c) => {
    const result = {
      "board": { },
      "main": { }
    }
    return c.json(result);
  })

  Bun.serve({
    fetch: app.fetch,
    port: 3008,
    // @ts-ignore
    idleTimeout: 60
  });
})();
