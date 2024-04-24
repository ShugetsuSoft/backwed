import { runRankTask } from "./tasks/rank";
import { syncronizeIllusts, syncronizeUsers } from "./tasks/sync";
import { connectMeliSearch, connectMongo } from "./utils/connect";
import { Config } from "./models/config";

const readConfig = async (path: string): Promise<Config> => {
  const file = Bun.file(path);
  return await file.json();
};

const args = process.argv.slice(2);
const flags: Record<string, string | boolean> = {};

args.forEach((arg, index) => {
  if (arg.startsWith("--")) {
    const flagName = arg.slice(2);
    const nextArg = args[index + 1];
    if (nextArg && !nextArg.startsWith("--")) {
      flags[flagName] = nextArg;
    } else {
      flags[flagName] = true;
    }
  }
});

if (flags["help"]) {
  console.log("You Don't Need Help");
  process.exit(0);
}
(async () => {
  await readConfig("config.json");
  await connectMongo();
  await connectMeliSearch();
  if (flags["rank"]) {
    await runRankTask();
  } else if (flags["sync"]) {
    if (flags["sync"] == "users") {
      console.log("Syncronizing Users");
      await syncronizeUsers();
    } else {
      console.log("Syncronizing Illusts");
      await syncronizeIllusts();
    }
  }
})();
