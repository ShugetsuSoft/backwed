import { runRankTask } from "./tasks/rank";
import { syncronizeIllusts, syncronizeUsers } from "./tasks/sync";
import { connectMeliSearch, connectMongo } from "./utils/connect";
import { readConfig } from "./models/config";
import { loadFilter } from "./utils/filter";
import { initSearch } from "./models/search";

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
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
  await connectMongo();
  await connectMeliSearch();
  await initSearch();
  await loadFilter();
  if (flags["rank"]) {
    if (flags["rank"] !== true) {
      await runRankTask(flags["rank"] as string);
    } else {
      await runRankTask(null);
    }
  } else if (flags["sync"]) {
    if (flags["sync"] == "users") {
      console.log("Syncronizing Users");
      await syncronizeUsers();
    } else {
      console.log("Syncronizing Illusts");
      await syncronizeIllusts();
    }
  }
  process.exit(0);
})();
