import { fetchIllustBody, fetchUserBody } from "../models/pixiv";
import { filter } from "./filter";

export function calcIllustPop(bookmarks: number, likes: number) {
  return (bookmarks * 70 + likes * 30) / 100;
}

export function parseImgTime(url: string) {
  const date_str = url.substring(
    url.indexOf("/img/") + 5,
    url.lastIndexOf("/")
  );
  let parts = date_str.replace(/\//g, " ").split(" ");
  let formattedString = `${parts[0]}-${parts[1]}-${parts[2]}T${parts[3]}:${parts[4]}:${parts[5]}`;
  let date = new Date(formattedString);
  return date;
}

const bannedTagList = ["+18", "nude", "r18", "r-18", "r-18g"];

export function isIllustBanned(raw: fetchIllustBody) {
  if (raw.xRestrict == 1) {
    return true;
  }
  for (let i = 0; i < raw.tags.tags.length; i++) {
    if (raw.tags.tags[i].tag.toLowerCase() in bannedTagList) {
      return true;
    }
  }
  if (filter.check(raw.title)) {
    return true;
  }
  if (filter.check(raw.alt)) {
    return true;
  }
  if (filter.check(raw.illustComment)) {
    return true;
  }
  if (filter.check(raw.tags.tags.map((tag) => tag.tag).join(", "))) {
    return true;
  }
  return false;
}

export function filtered(content: string) {
  return filter.detoxify(content);
}

export function isUserBanned(raw: fetchUserBody) {
  if (filter.check(raw.comment)) {
    return true;
  }
  if (filter.check(raw.name)) {
    return true;
  }
  return false;
}