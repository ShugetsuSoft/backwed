import { connections } from "../utils/connect";

export const initSearch = async (openiKey: string) => {
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
    embedders: {
      default: {
        source: "openAi",
        apiKey: openiKey,
        model: "text-embedding-3-small",
        documentTemplate:
          "An illustration about {{doc.originalTags||join:', '}}",
        dimensions: 1536,
      },
    },
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
