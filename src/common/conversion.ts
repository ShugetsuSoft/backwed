import {
  fetchIllustBody,
  fetchUgoiraBody,
  fetchUserBody,
  fetchUserIllustsBody,
} from "../models/pixiv";
import { calcIllustPop, filtered, isIllustBanned, isUserBanned, parseImg } from "../utils/calc";
import { Illust, Ugoira, User } from "../models/db";
import {
  BackendResponse,
  IllustResponse,
  IllustsResponse,
  UgoiraResponse,
  UserResponse,
  UsersResponse,
} from "../models/response";
import { Errors } from "../models/const";
import { IllustSearch, UserSearch } from "../models/search";

export const ok = (data: any): BackendResponse => {
  return {
    status: 0,
    data: data,
  };
};

export const error = (error: Errors): BackendResponse => {
  let message = "服务器内部错误，请联系管理员";
  switch (error) {
    case Errors.Banned:
      message = "该文档已被封禁";
      break;
    case Errors.InvalidRequest:
      message = "请求参数错误";
      break;
    case Errors.TryInFewMinutes:
      message = "请稍后再试";
      break;
  }
  return {
    status: error,
    message: message,
  };
};

export const fromPixivIllust = (data: fetchIllustBody) => {
  return new Illust({
    _id: parseInt(data.id),
    title: data.title,
    altTitle: data.alt,
    description: filtered(data.description??""),
    type: data.illustType,
    createDate: new Date(data.createDate),
    uploadDate: new Date(data.uploadDate),
    sanity: data.sl,
    width: data.width,
    height: data.height,
    pageCount: data.pageCount,
    tags: data.tags.tags.map((tag) => ({
      name: tag.tag,
      translation: tag.translation?.en ?? undefined,
    })),
    statistic: {
      bookmarks: data.bookmarkCount,
      likes: data.likeCount,
      comments: data.commentCount,
      views: data.viewCount,
    },
    user: parseInt(data.userId),
    popularity: calcIllustPop(data.bookmarkCount, data.likeCount),
    banned: isIllustBanned(data),
    image: parseImg(data.urls.original),
    aiType: data.aiType,
  });
};

export const toIllustResponse = (illust: Illust): IllustResponse => {
  return {
    id: illust._id ?? 0,
    title: illust.title ?? "",
    altTitle: illust.altTitle ?? "",
    description: illust.description ?? "",
    type: illust.type ?? 0,
    createDate: illust.createDate?.toISOString() ?? "",
    uploadDate: illust.uploadDate?.toISOString() ?? "",
    sanity: illust.sanity ?? 0,
    width: illust.width ?? 0,
    height: illust.height ?? 0,
    pageCount: illust.pageCount ?? 0,
    tags: illust.tags.map((tag) => ({
      name: tag.name ?? "",
      translation: tag.translation ?? undefined,
    })),
    statistic: {
      bookmarks: illust.statistic?.bookmarks ?? 0,
      likes: illust.statistic?.likes ?? 0,
      comments: illust.statistic?.comments ?? 0,
      views: illust.statistic?.views ?? 0,
    },
    user: illust.user ?? 0,
    image: illust.image ?? "",
    aiType: illust.aiType ?? 0,
  };
};

export const toIllustSearch = (illust: Illust): IllustSearch => {
  const originalTags: string[] = [];
  const translatedTags: string[] = [];
  illust.tags.forEach((tag) => {
    if (tag.name) originalTags.push(tag.name);
    if (tag.translation) translatedTags.push(tag.translation);
  });
  return {
    id: illust._id ?? 0,
    title: illust.title ?? "",
    altTitle: illust.altTitle ?? "",
    createTime: illust.createDate?.getTime() ?? 0,
    description: illust.description ?? "",
    type: illust.type ?? 0,
    sanity: illust.sanity ?? 0,
    user: illust.user ?? 0,
    aiType: illust.aiType ?? 0,
    popularity: illust.popularity ?? 0,
    banned: illust.banned ?? false,
    originalTags: originalTags,
    translatedTags: translatedTags,
  };
};

export const fromPixivUser = (data: fetchUserBody) => {
  return new User({
    _id: parseInt(data.userId),
    name: filtered(data.name),
    bio: filtered(data.comment),
    image: {
      url: data.image,
      bigUrl: data.imageBig,
      background: data.background?.url ?? undefined,
    },
    illusts_update_time: new Date(0),
    banned: isUserBanned(data),
  });
};

export const toUserResponse = (user: User): UserResponse => {
  return {
    id: user._id ?? 0,
    name: user.name ?? "",
    bio: user.bio ?? "",
    image: {
      url: user.image?.url ?? "",
      bigUrl: user.image?.bigUrl ?? "",
      background: user.image?.background ?? undefined,
    },
  };
};

export const toUserSearch = (user: User): UserSearch => {
   return {
    id: user._id ?? 0,
    name: user.name ?? "",
    banned: user.banned ?? false,
    bio: user.bio ?? "",
   }
}

export const fromPixivUserIllusts = (data: fetchUserIllustsBody): string[] => {
  return Object.keys(data.illusts).concat(Object.keys(data.manga));
};

export const toUserIllustsResponse = (
  illusts: IllustResponse[],
  user: UserResponse,
  hasNext: boolean
) => {
  return {
    illusts: illusts,
    user: user,
    hasNext: hasNext,
  };
};

export const toUsersReponse = (users: UserResponse[], hasNext: boolean): UsersResponse => {
  return {
    users: users,
    hasNext: hasNext,
  };
}

export const toIllustsResponse = (
  illusts: IllustResponse[],
  has_next: boolean
): IllustsResponse => {
  return {
    illusts: illusts,
    hasNext: has_next,
  };
};

export const fromPixivUgoira = (data: fetchUgoiraBody, id: number) => {
  return new Ugoira({
    _id: id,
    mimeType: data.mime_type,
    image: parseImg(data.src),
    frames: data.frames.map((frame) => ({
      file: frame.file,
      delay: frame.delay,
    })),
  });
};

export const toUgoiraResponse = (ugoira: Ugoira): UgoiraResponse => {
  return {
    id: ugoira._id ?? 0,
    image: ugoira.image ?? "",
    mimeType: ugoira.mimeType ?? "",
    frames: ugoira.frames.map((frame) => ({
      file: frame.file ?? "",
      delay: frame.delay ?? 0,
    })),
  };
};
