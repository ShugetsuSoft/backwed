import { Mongoose, connect as mongooseConnect } from "mongoose";
import { MeiliSearch } from 'meilisearch'

interface Connections {
  mongo?: Mongoose;
  meli?: MeiliSearch;
}

export const connections: Connections = {};

export const connectMongo = async (uri: string): Promise<Connections> => {
  const mongo = await mongooseConnect(uri);
  console.log("MongoDB connected");
  connections.mongo = mongo;
  return connections;
};

export const connectMeliSearch = async(uri: string, key: string | undefined): Promise<Connections> => {
  const meli = new MeiliSearch({
    host: uri,
    apiKey: key,
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
