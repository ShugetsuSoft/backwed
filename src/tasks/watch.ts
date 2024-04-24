import { Illust } from "../models/db";
import { connections } from "../utils/connect";

export const watch = () => {
  Illust.watch().on("change", async (change) => {
    if (change.operationType === "insert") {
        console.log(change.fullDocument)
      /*await connections.meli
        ?.index("your-index")
        .addDocuments([change.fullDocument]);*/
    } else if (change.operationType === "update") {
      /*const { _id } = change.documentKey;
      const updatedDocument = await Illust.findOne({ _id });
      await connections.meli
        ?.index("your-index")
        .updateDocuments([updatedDocument]);*/
    } else if (change.operationType === "delete") {
      /*const { _id } = change.documentKey;
      await connections.meli?.index("your-index").deleteDocument(_id);*/
    }
    return;
  });
};
