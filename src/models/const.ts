export const PAGE_LIMIT = 50;
export enum Errors {
  Banned = 0,
  InvalidRequest = 1,
  TryInFewMinutes = 2,
}
export const CONCURRENCY = 2;
export const RANK_CONTENTS = ["all", "illust", "manga", "ugoira"];
export const RANK_MODES: Record<string, string[]> = {
  all: ["daily", "weekly", "monthly", "rookie", "original", "male", "female"],
  illust: ["daily", "weekly", "monthly", "rookie"],
  manga: ["daily", "weekly", "monthly", "rookie"],
  ugoira: ["daily", "weekly"],
};
