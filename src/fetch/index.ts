import { config } from "../models/config";
import {
  fetchIllustBody,
  fetchUserBody,
  fetchUserIllustsBody,
  fetchUgoiraBody,
  fetchRankRoot,
} from "../models/pixiv";

export const fetchIllust = async (
  illust_id: string
): Promise<fetchIllustBody> => {
  /*
  const url = `https://www.pixiv.net/ajax/illust/${illust_id}?lang=zh&full=1`;
  console.log(url)
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.pixiv.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
    },
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
  });
  const json = await response.json();
  const illust: fetchIllustBody = json.body;
  if (!illust.urls.original) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const token =
      config.pixiv.token[Math.floor(Math.random() * config.pixiv.token.length)];
    const response = await fetch(url, {
      headers: {
        Referer: "https://www.pixiv.net/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
        Cookie: `PHPSESSID=${token}`,
      },
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    });
    const json = await response.json();
    const illust: fetchIllustBody = json.body;
    return illust;
  }*/
  const url = `https://www.pixiv.net/ajax/illust/${illust_id}?lang=zh&full=1`;
  const token =
      config.pixiv.token[Math.floor(Math.random() * config.pixiv.token.length)];
    const response = await fetch(url, {
      headers: {
        Referer: "https://www.pixiv.net/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
        Cookie: `PHPSESSID=${token}`,
      },
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    });
    const json = await response.json();
    const illust: fetchIllustBody = json.body;
  return illust;
};

export const fetchUser = async (user_id: string): Promise<fetchUserBody> => {
  const url = `https://www.pixiv.net/ajax/user/${user_id}?lang=zh&full=1`;
  console.log(url)
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.pixiv.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
    },
    method: "GET",
    mode: "cors",
  });
  const json = await response.json();
  return json.body;
};

export const fetchUserIllusts = async (
  user_id: string
): Promise<fetchUserIllustsBody> => {
  const token =
    config.pixiv.token[Math.floor(Math.random() * config.pixiv.token.length)];
  const url = `https://www.pixiv.net/ajax/user/${user_id}/profile/all?lang=zh&full=1`;
  console.log(url)
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.pixiv.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
      Cookie: `PHPSESSID=${token}`,
    },
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
  });
  const json = await response.json();
  return json.body;
};

export const fetchUgoira = async (
  illust_id: string
): Promise<fetchUgoiraBody> => {
  const token =
    config.pixiv.token[Math.floor(Math.random() * config.pixiv.token.length)];
  const url = `https://www.pixiv.net/ajax/illust/${illust_id}/ugoira_meta`;
  console.log(url)
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.pixiv.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
      Cookie: `PHPSESSID=${token}`,
    },
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
  });
  const json = await response.json();
  return json.body;
};

export const fetchRank = async (
  mode: string,
  page: number,
  date: string,
  content: string
): Promise<fetchRankRoot> => {
  const url = `https://www.pixiv.net/ranking.php?mode=${mode}&p=${page}&date=${date}&format=json&lang=zh&full=1&content=${content}`;
  console.log(url)
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.pixiv.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
    },
    method: "GET",
    mode: "cors",
  });
  const json = await response.json();
  return json;
};
