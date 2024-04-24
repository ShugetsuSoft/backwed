import { fetchIllustBody, fetchUserBody, fetchUserIllustsBody, fetchUgoiraBody, fetchRankRoot } from '../models/pixiv';

export const fetchIllust = async (illust_id: string): Promise<fetchIllustBody> => {
  const url = `https://www.pixiv.net/ajax/illust/${illust_id}?lang=zh&full=1`;
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.pixiv.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
    },
    verbose: true,
    method: "GET",
    mode: "cors",
  });
  const json = await response.json();
  return json.body;
};

export const fetchUser = async (user_id: string): Promise<fetchUserBody> => {
  const url = `https://www.pixiv.net/ajax/user/${user_id}?lang=zh&full=1`;
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.pixiv.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
    },
    verbose: true,
    method: "GET",
    mode: "cors",
  });
  const json = await response.json();
  return json.body;
}

export const fetchUserIllusts = async (user_id: string): Promise<fetchUserIllustsBody> => {
  const url = `https://www.pixiv.net/ajax/user/${user_id}/profile/all?lang=zh&full=1`;
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.pixiv.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
    },
    verbose: true,
    method: "GET",
    mode: "cors",
  });
  const json = await response.json();
  return json.body;
}

export const fetchUgoira = async (illust_id: string): Promise<fetchUgoiraBody> => {
  const url = `https://www.pixiv.net/ajax/illust/${illust_id}/ugoira_meta`;
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.pixiv.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
    },
    verbose: true,
    method: "GET",
    mode: "cors",
  });
  const json = await response.json();
  return json.body;
}

export const fetchRank = async (mode: string, page: number, date: string, content: string): Promise<fetchRankRoot> => {
  const url = `https://www.pixiv.net/ranking.php?mode=${mode}&p=${page}&date=${date}&format=json&lang=zh&full=1&content=${content}`;
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.pixiv.net/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
    },
    verbose: true,
    method: "GET",
    mode: "cors",
  });
  const json = await response.json();
  return json;
}