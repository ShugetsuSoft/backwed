export interface fetchIllustBody {
  illustId: string;
  illustTitle: string;
  illustComment: string;
  id: string;
  title: string;
  description: string;
  illustType: number;
  createDate: string;
  uploadDate: string;
  restrict: number;
  xRestrict: number;
  sl: number;
  urls: fetchIllustUrls;
  tags: fetchIllustTags;
  alt: string;
  userId: string;
  userName: string;
  userAccount: string;
  likeData: boolean;
  width: number;
  height: number;
  pageCount: number;
  bookmarkCount: number;
  likeCount: number;
  commentCount: number;
  responseCount: number;
  viewCount: number;
  bookStyle: number;
  isHowto: boolean;
  isOriginal: boolean;
  imageResponseOutData: any[];
  imageResponseData: any[];
  imageResponseCount: number;
  pollData: any;
  seriesNavData: any;
  descriptionBoothId: any;
  descriptionYoutubeId: any;
  comicPromotion: any;
  fanboxPromotion: any;
  contestBanners: any[];
  isBookmarkable: boolean;
  bookmarkData: any;
  contestData: any;
  isUnlisted: boolean;
  request: any;
  commentOff: number;
  aiType: number;
  reuploadDate: any;
  locationMask: boolean;
  commissionIllustHaveRisk: boolean;
}

export interface fetchIllustUrls {
  mini: string;
  thumb: string;
  small: string;
  regular: string;
  original: string;
}

export interface fetchIllustTags {
  authorId: string;
  isLocked: boolean;
  tags: fetchIllustTag[];
  writable: boolean;
}

export interface fetchIllustTag {
  tag: string;
  locked: boolean;
  deletable: boolean;
  userId?: string;
  translation: fetchIllustTranslation;
  userName?: string;
}

export interface fetchIllustTranslation {
  en: string;
}

export interface fetchUserBody {
  userId: string
  name: string
  image: string
  imageBig: string
  premium: boolean
  isFollowed: boolean
  isMypixiv: boolean
  isBlocking: boolean
  background?: fetchUserBackground
  partial: number
  acceptRequest: boolean
  following: number
  mypixivCount: number
  followedBack: boolean
  comment: string
  commentHtml: string
  webpage: string
  canSendMessage: boolean
  official: boolean
}

export interface fetchUserBackground {
  url: string
  isPrivate: boolean
}

export interface fetchUserIllustsBody {
  illusts: fetchUserIllustsKeys
  manga: fetchUserIllustsKeys
}

export interface fetchUserIllustsKeys {
  [id: string]: null
}

export interface fetchUgoiraBody {
  src: string
  originalSrc: string
  mime_type: string
  frames: fetchUgoiraFrame[]
}

export interface fetchUgoiraFrame {
  file: string
  delay: number
}

export interface fetchRankRoot {
  contents: fetchRankContent[]
  mode: string
  content: string
  page: number
  prev: boolean|number
  next: number|boolean
  date: string
  prev_date: string
  next_date: boolean
  rank_total: number
}

export interface fetchRankContent {
  title: string
  date: string
  tags: string[]
  url: string
  illust_type: string
  illust_book_style: string
  illust_page_count: string
  user_name: string
  profile_img: string
  illust_content_type: fetchRankIllustContentType
  illust_series: any
  illust_id: number
  width: number
  height: number
  user_id: number
  rank: number
  yes_rank: number
  rating_count: number
  view_count: number
  illust_upload_timestamp: number
  attr: string
  is_bookmarked: boolean
  bookmarkable: boolean
}

export interface fetchRankIllustContentType {
  sexual: number
  lo: boolean
  grotesque: boolean
  violent: boolean
  homosexual: boolean
  drug: boolean
  thoughts: boolean
  antisocial: boolean
  religion: boolean
  original: boolean
  furry: boolean
  bl: boolean
  yuri: boolean
}
