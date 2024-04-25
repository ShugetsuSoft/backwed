import { Schema, model, InferSchemaType, Types } from "mongoose";

const userSchema = new Schema(
  {
    _id: Number,
    name: String,
    bio: String,
    image: {
      url: String,
      bigUrl: String,
      background: String,
    },
    illusts_update_time: Date,
    banned: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const illustSchema = new Schema(
  {
    _id: Number,
    title: String,
    altTitle: String,
    description: String,
    type: {
      type: Number,
      default: 0,
      index: true,
    },
    createDate: {
      type: Date,
      index: true,
    },
    uploadDate: Date,
    sanity: {
      type: Number,
      default: 0,
      index: true,
    },
    width: Number,
    height: Number,
    pageCount: Number,
    tags: [{
      name: {
        type: String,
        index: true,
      },
      translation: String,
    }],
    statistic: {
      bookmarks: Number,
      likes: Number,
      comments: Number,
      views: Number,
    },
    user: {
      type: Number,
      index: true,
    },
    image: String,
    aiType: {
      type: Number,
      default: 0,
      index: true,
    },
    popularity: Number,
    banned: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    methods: {
    },
  }
);

const rankSchema = new Schema(
  {
    date: {
      type: String,
    },
    mode: {
      type: String,
    },
    content: {
      type: String,
    },
    illusts: [
      {
        id: Number,
        rank: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

rankSchema.index({ date: -1, mode: 1, content: 1 }, { unique: true });

const ugoiraSchema = new Schema(
  {
    _id: Number,
    update_time: Date,
    image: String,
    mimeType: String,
    frames: [
      {
        file: String,
        delay: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
export type User = InferSchemaType<typeof userSchema>;

export const Illust = model("Illust", illustSchema);
export type Illust = InferSchemaType<typeof illustSchema>;

export const Rank = model("Rank", rankSchema);
export type Rank = InferSchemaType<typeof rankSchema>;

export const Ugoira = model("Ugoira", ugoiraSchema);
export type Ugoira = InferSchemaType<typeof ugoiraSchema>;
