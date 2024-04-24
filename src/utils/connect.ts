import { Mongoose, connect as mongooseConnect } from "mongoose";
import { MeiliSearch } from 'meilisearch'
import { config } from "../models/config";

interface Connections {
  mongo?: Mongoose;
  meli?: MeiliSearch;
}

export const connections: Connections = {};

export const connectMongo = async (): Promise<Connections> => {
  const mongo = await mongooseConnect(config.mongo.uri);
  console.log("MongoDB connected");
  connections.mongo = mongo;
  return connections;
};

export const connectMeliSearch = async(): Promise<Connections> => {
  const meli = new MeiliSearch({
    host: config.meli.uri,
    apiKey: config.meli.key,
  })
  console.log("MeiliSearch connected")
  connections.meli = meli
  return connections
}

const disconnectEverything = async () => {
  if (connections.mongo) {
    await connections.mongo.disconnect();
  }
};
