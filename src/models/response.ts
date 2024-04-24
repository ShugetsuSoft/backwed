import { Errors } from './const';

export interface UserImageResponse {
  url: string;
  bigUrl: string;
  background?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  bio: string;
  image: UserImageResponse;
}

export interface IllustTagResponse {
  name: string;
  translation?: string;
}

export interface IllustStatisticResponse {
  bookmarks: number;
  likes: number;
  comments: number;
  views: number;
}

export interface IllustResponse {
  id: number;
  title: string;
  altTitle: string;
  description: string;
  type: number;
  createDate: string;
  uploadDate: string;
  sanity: number;
  width: number;
  height: number;
  pageCount: number;
  tags: IllustTagResponse[];
  statistic: IllustStatisticResponse;
  user: number;
  image: string;
  aiType: number;
}

export interface IllustsResponse {
  illusts: IllustResponse[];
  hasNext: boolean;
}

export interface UserIllustsResponse {
  illusts: IllustResponse[];
  user: UserResponse;
  hasNext: boolean;
}

export interface UsersResponse {
  users: UserResponse[];
  hasNext: boolean;
}

export interface UsersSearchResponse {
  users: UserResponse[];
  scores: number[];
  highLight?: string[];
  hasNext: boolean;
}

export interface UgoiraFrameResponse {
  file: string;
  delay: number;
}

export interface UgoiraResponse {
  id: number;
  image: string;
  mimeType: string;
  frames: UgoiraFrameResponse[];
}

export interface BackendResponse {
  status: Errors;
  message?: string;
  data?: any;
}
