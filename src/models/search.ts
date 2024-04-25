import { connections } from "../utils/connect";
import { config } from "./config";

export const initSearch = async () => {
  await connections.meli?.createIndex("illusts", {
    primaryKey: "id",
  });
  await connections.meli?.index("illusts").updateSettings({
    searchableAttributes: [
      "title",
      "altTitle",
      "description",
      "originalTags",
      "translatedTags",
    ],
    displayedAttributes: [
      "id",
      "title",
      "altTitle",
      "description",
      "originalTags",
      "translatedTags",
    ],
    sortableAttributes: ["id", "popularity", "sanity", "createTime"],
    filterableAttributes: [
      "type",
      "sanity",
      "user",
      "aiType",
      "popularity",
      "banned",
      "originalTags",
      "translatedTags",
    ],
    /*embedders: {
      default: {
        source: "openAi",
        apiKey: config.openai.key,
        model: "text-embedding-3-small",
        documentTemplate:
          "An illustration about {{doc.originalTags}}",
        dimensions: 1536,
      },
    },*/
  });
  await connections.meli?.createIndex("users", {
    primaryKey: "id",
  });
  await connections.meli?.index("users").updateSettings({
    searchableAttributes: ["name", "bio"],
    displayedAttributes: ["id", "name", "bio"],
    filterableAttributes: ["banned"],
  });
};

export interface IllustSearch {
  id: number;
  title: string;
  altTitle: string;
  createTime: number;
  description: string;
  type: number;
  sanity: number;
  user: number;
  aiType: number;
  popularity: number;
  banned: boolean;
  originalTags: string[];
  translatedTags: string[];
}

export interface UserSearch {
  id: number;
  name: string;
  banned: boolean;
  bio: string;
}
