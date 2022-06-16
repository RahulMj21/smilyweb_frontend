import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface Comment {
  user: {
    name: string;
    _id: string;
  };
  comment: string;
  time: Date;
}

export interface postInterface {
  caption: string;
  comments: [] | Comment[];
  createdAt: string;
  image: {
    public_id: string;
    secure_url: string;
  };
  likes: [] | [{ user: string }];
  postCreator: {
    _id: string;
    name: string;
    avatar: { public_id: string; secure_url: string };
  };
  shares: number;
  updatedAt: string;
  __v: number;
  _id: string;
}

const initialState: {
  posts: postInterface[] | null;
} = {
  posts: null,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<postInterface[]>) => {
      state.posts = action.payload;
    },
    clearPosts: (state) => {
      state.posts = null;
    },
  },
});

export const { setPosts, clearPosts } = postsSlice.actions;

export const selectPosts = (state: RootState) => state.posts.posts;

export default postsSlice.reducer;
