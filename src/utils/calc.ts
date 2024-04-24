import { fetchIllustBody } from "../models/pixiv";

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
  return false;
}
