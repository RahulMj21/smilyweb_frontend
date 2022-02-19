import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface userInterface {
  avatar: {
    public_id: string;
    secure_url: string;
  };
  _id: string;
  email: string;
  createdAt: string;
  followers: [{ user: string }];
  following: [{ user: string }];
  isLoggedInWithGoogle: Boolean;
  name: string;
  role: string;
}

const initialState: {
  user: userInterface | null;
  isLoggedIn: Boolean;
} = {
  user: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<userInterface>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;

export default userSlice.reducer;
