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
    banned: Boolean,
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
    type: Number,
    createDate: Date,
    uploadDate: Date,
    sanity: Number,
    width: Number,
    height: Number,
    pageCount: Number,
    tags: [{
      name: String,
      translation: String,
    }],
    statistic: {
      bookmarks: Number,
      likes: Number,
      comments: Number,
      views: Number,
    },
    user: Number,
    image: Date,
    aiType: Number,
    popularity: Number,
    banned: Boolean,
  },
  {
    timestamps: true,
    methods: {
    },
  }
);

const rankSchema = new Schema(
  {
    date: String,
    mode: String,
    content: String,
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

const ugoiraSchema = new Schema(
  {
    _id: Number,
    update_time: Date,
    image: Date,
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
