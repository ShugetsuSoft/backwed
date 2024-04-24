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

export interface PixivConfig {
  token: string[];
  device_token: string[];
}

export interface FilterConfig {
  file: string;
}

export interface Config {
  mongo: MongoConfig;
  meli: MeiliConfig;
  openai: OpenAiConfig;
  pixiv: PixivConfig;
  filter: FilterConfig;
}

export var config: Config = {} as Config

export const readConfig = async (path: string): Promise<Config> => {
  const file = Bun.file(path)
  config = await file.json()
  return config
}