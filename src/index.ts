import { Hono } from "hono";
import v3 from "./router/v3";
import { connectMongo, connectMeliSearch } from "./utils/connect";
import { initSearch } from "./models/search";
import { readConfig } from "./models/config";

(async () => {
  await readConfig("config.json");
  await connectMongo();
  await connectMeliSearch();
  await initSearch();
})();

const app = new Hono({});
app.route("/v3", v3);

export default {
  fetch: app.fetch,
  port: 3000,
};
