export const PAGE_LIMIT = 50;
export enum Errors {
  Banned = 1,
  InvalidRequest = 2,
  TryInFewMinutes = 3,
}
export const CONCURRENCY = 1;
export const RANK_CONTENTS = ["all", "illust", "manga", "ugoira"];
export const RANK_MODES: Record<string, string[]> = {
  all: ["daily", "weekly", "monthly", "rookie", "original", "male", "female"],
  illust: ["daily", "weekly", "monthly", "rookie"],
  manga: ["daily", "weekly", "monthly", "rookie"],
  ugoira: ["daily", "weekly"],
};
