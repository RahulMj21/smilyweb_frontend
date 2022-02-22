import axios from "axios";
import { loginUserInput } from "../pages/auth/login";
import { createUserInput } from "../pages/auth/register";
import { updatePasswordInput } from "../pages/auth/updatepassword";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
});

// auth ------------------------------------>
export const registerUser = (input: createUserInput) =>
  api.post("/register", input);

export const loginUser = (input: loginUserInput) => api.post("/login", input);

export const logoutUser = () => api.get("/logout");

// user ---------------------------------->
export const getCurrentUser = () => api.get("/me");

export const getSingleUser = (id: string) => api.get(`/user/${id}`);

export const adminDeleteUser = (id: string) => api.delete(`/user/${id}`);

export const adminAllUsers = () => api.get("/users");

export const updatePassword = (input: updatePasswordInput) =>
  api.put("/user/password/update", input);

export const fotgotPassword = () => api.get("/user/password/forgot");

export const resetPassword = (token: string, input: any) =>
  api.put(`/user/password/reset/${token}`, input);

export const updateUserInfo = (input: { name: string; email: string }) =>
  api.put("/user/details/update", input);

export const updateUserAvatar = (input: string) =>
  api.put("/user/avatar/update", { avatar: input });

export const doFollowUser = (id: string) => api.put(`/user/follow/${id}`);

export const doUnFollowUser = (id: string) => api.put(`/user/unfollow/${id}`);

// post -------------------------------->
export const createPost = (input: { image: string; caption: string }) =>
  api.post("/post/new", input);

export const getAllPosts = () => api.get("/posts");

export const getUserAllPosts = (id: string) => api.get(`/user/posts/${id}`);

export const getSinglePost = (id: string) => api.get(`/post/${id}`);

export const deletePost = (id: string) => api.delete(`/post/${id}`);

export const likePost = (id: string) => api.put(`/likepost/${id}`);

export const disLikePost = (id: string) => api.put(`/dislikepost/${id}`);

export const sharePost = (id: string) => api.put(`/sharepost/${id}`);

export const makeComment = (id: string, input: { comment: string }) =>
  api.put(`/makecomment/${id}`, input);
