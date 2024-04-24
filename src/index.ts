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

(async () => {
  await readConfig("config.json");
  await connectMongo();
  await connectMeliSearch();
  await initSearch();
  await loadFilter();
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

  Bun.serve({
    fetch: app.fetch,
    port: 3008,
  });
})();
