  import { config } from "../models/config";
  import {
    fetchIllustBody,
    fetchUserBody,
    fetchUserIllustsBody,
    fetchUgoiraBody,
    fetchRankRoot,
  } from "../models/pixiv";
  import { randomBytes } from 'crypto';

  // Function to generate device token
  const generateDeviceToken = () => {
    return randomBytes(16).toString('hex');
  };
  // Promise queue implementation with rate limiting and concurrency control
  class PromiseQueue {
    private queue: (() => Promise<any>)[] = [];
    private activePromises: number = 0;
    private readonly maxConcurrent: number;

    constructor(maxConcurrent: number = 2) {
      this.maxConcurrent = maxConcurrent;
    }

    async add<T>(promiseFactory: () => Promise<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        this.queue.push(async () => {
          try {
            const result = await promiseFactory();
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            this.activePromises--;
            this.processQueue();
          }
        });
        this.processQueue();
      });
    }

    private async processQueue() {
      if (this.queue.length === 0 || this.activePromises >= this.maxConcurrent) {
        return;
      }

      this.activePromises++;
      const nextPromise = this.queue.shift();

      if (nextPromise) {
        try {
          await nextPromise();
        } catch (error) {
          console.error('Promise execution failed:', error);
        }
      }
    }
  }
  // Create a global queue instance for all Pixiv API requests
  const pixivQueue = new PromiseQueue();

  // Helper function to handle fetch errors
  const handleFetchError = (error: any, url: string, whichToken: number) => {
    console.error(`Error fetching ${url}:`, error);
    console.log({
      status: error.status || 'Unknown',
      statusText: error.statusText || 'Unknown',
      tokenIndex: whichToken,
      message: error.message || 'No error message',
    });
    return null;
  };

  export const fetchIllust = async (
    illust_id: string,
    cookie?: boolean
  ): Promise<fetchIllustBody | null> => {
    const url = `https://www.pixiv.net/ajax/illust/${illust_id}?lang=zh&full=1&version=579269affc03bbd7d38d523b7c4dd51b40464f4c`;
    console.log(url)

    const whichToken = Math.floor(Math.random() * config.pixiv.token.length)
    const token = config.pixiv.token[whichToken];
    const whichProxy = Math.floor(Math.random() * config.pixiv.proxies.length);
    const proxy = config.pixiv.proxies[whichProxy];
    const deviceToken = generateDeviceToken();

    try {
      const fetchResult = await pixivQueue.add(async () => {
        const response = await fetch(url, {
          headers: {
            Referer: "https://www.pixiv.net/",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
            Cookie: cookie ? `PHPSESSID=${token}; device_token=${deviceToken}` : `device_token=${deviceToken}`,
            Origin: "https://www.pixiv.net",
          },
          method: "GET",
          mode: "cors",
          credentials: "same-origin",
          proxy: proxy,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      });

      const illust: fetchIllustBody = fetchResult.body;

      if (!illust.urls?.original) {
        if (cookie) {
          return null;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return await fetchIllust(illust_id, true); // Retry with cookie header
      }

      return illust;
    } catch (error) {
      return handleFetchError(error, url, whichToken);
    }
  };

  export const fetchUser = async (user_id: string): Promise<fetchUserBody | null> => {
    const url = `https://www.pixiv.net/ajax/user/${user_id}?lang=zh&full=1`;
    console.log(url);
    const whichToken = Math.floor(Math.random() * config.pixiv.token.length);
    const token = config.pixiv.token[whichToken];
    const whichProxy = Math.floor(Math.random() * config.pixiv.proxies.length);
    const proxy = config.pixiv.proxies[whichProxy];
    const deviceToken = generateDeviceToken();

    try {
      const fetchResult = await pixivQueue.add(async () => {
        const response = await fetch(url, {
          headers: {
            Referer: "https://www.pixiv.net/",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
            Cookie: `PHPSESSID=${token}; device_token=${deviceToken}`,
            Origin: "https://www.pixiv.net",
          },
          method: "GET",
          mode: "cors",
          credentials: "same-origin",
          proxy: proxy,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      });

      return fetchResult.body;
    } catch (error) {
      return handleFetchError(error, url, whichToken);
    }
  };

  export const fetchUserIllusts = async (
    user_id: string
  ): Promise<fetchUserIllustsBody | null> => {
    const url = `https://www.pixiv.net/ajax/user/${user_id}/profile/all?lang=zh&full=1`;
    console.log(url);
    const whichToken = Math.floor(Math.random() * config.pixiv.token.length);
    const token = config.pixiv.token[whichToken];
    const whichProxy = Math.floor(Math.random() * config.pixiv.proxies.length);
    const proxy = config.pixiv.proxies[whichProxy];
    const deviceToken = generateDeviceToken();

    try {
      const fetchResult = await pixivQueue.add(async () => {
        const response = await fetch(url, {
          headers: {
            Referer: "https://www.pixiv.net/",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
            Cookie: `PHPSESSID=${token}; device_token=${deviceToken}`,
            Origin: "https://www.pixiv.net",
          },
          method: "GET",
          mode: "cors",
          credentials: "same-origin",
          proxy: proxy,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      });

      return fetchResult.body;
    } catch (error) {
      return handleFetchError(error, url, whichToken);
    }
  };

  export const fetchUgoira = async (
    illust_id: string
  ): Promise<fetchUgoiraBody | null> => {
    const url = `https://www.pixiv.net/ajax/illust/${illust_id}/ugoira_meta`;
    console.log(url);
    const whichToken = Math.floor(Math.random() * config.pixiv.token.length);
    const token = config.pixiv.token[whichToken];
    const whichProxy = Math.floor(Math.random() * config.pixiv.proxies.length);
    const proxy = config.pixiv.proxies[whichProxy];
    const deviceToken = generateDeviceToken();

    try {
      const fetchResult = await pixivQueue.add(async () => {
        const response = await fetch(url, {
          headers: {
            Referer: "https://www.pixiv.net/",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
            Cookie: `PHPSESSID=${token}; device_token=${deviceToken}`,
            Origin: "https://www.pixiv.net",
          },
          method: "GET",
          mode: "cors",
          credentials: "same-origin",
          proxy: proxy,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      });

      return fetchResult.body;
    } catch (error) {
      return handleFetchError(error, url, whichToken);
    }
  };

  export const fetchRank = async (
    mode: string,
    page: number,
    date: string,
    content: string
  ): Promise<fetchRankRoot | null> => {
    const url = `https://www.pixiv.net/ranking.php?mode=${mode}&p=${page}&date=${date}&format=json&lang=zh&full=1&content=${content}`;
    console.log(url);
    const whichToken = Math.floor(Math.random() * config.pixiv.token.length);
    const token = config.pixiv.token[whichToken];
    const whichProxy = Math.floor(Math.random() * config.pixiv.proxies.length);
    const proxy = config.pixiv.proxies[whichProxy];
    const deviceToken = generateDeviceToken();

    try {
      const fetchResult = await pixivQueue.add(async () => {
        const response = await fetch(url, {
          headers: {
            Referer: "https://www.pixiv.net/",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
            Cookie: `PHPSESSID=${token}; device_token=${deviceToken}`,
            Origin: "https://www.pixiv.net",
          },
          method: "GET",
          mode: "cors",
          credentials: "same-origin",
          proxy: proxy,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      });

      return fetchResult;
    } catch (error) {
      return handleFetchError(error, url, whichToken);
    }
  };
