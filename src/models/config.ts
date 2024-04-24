export interface MongoConfig {
  uri: string;
}

export interface MeiliConfig {
  uri: string;
  key: string | undefined;
}

export interface OpenAiConfig {
  key: string;
}

export interface Config {
  mongo: MongoConfig;
  meli: MeiliConfig;
  openai: OpenAiConfig;
}
