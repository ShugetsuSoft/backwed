import { Hono } from "hono";
import v3 from "./router/v3";
import { connectMongo, connectMeliSearch } from "./utils/connect";
import { initSearch } from "./models/search";
import { Config } from "./models/config"

const readConfig = async (path: string): Promise<Config> => {
    const file = Bun.file(path)
    return await file.json()
}

(async () => {
  const cfg = await readConfig("config.json")
  await connectMongo(cfg.mongo.uri);
  await connectMeliSearch(
    cfg.meli.uri,
    cfg.meli.key,
  );
  await initSearch(cfg.openai.key)
})();

const app = new Hono({
});
app.route("/v3", v3);

export default {
  fetch: app.fetch,
  port: 3000,
};
