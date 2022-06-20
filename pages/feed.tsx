import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import FeedPost from "../components/FeedPost";
import Image from "next/image";
import { FaUserAlt, FaPlus } from "react-icons/fa";
import PostModal from "../components/PostModal";
import { selectUser, setUser } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { NextRouter, useRouter } from "next/router";
import { getAllPosts, getCurrentUser, getSinglePost } from "../utils/api";
import moment from "moment";
import Link from "next/link";
import { postInterface, selectPosts, setPosts } from "../slices/postSlice";
import { io } from "socket.io-client";
import { useAlert } from "react-alert";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

export const socket = io(process.env.NEXT_PUBLIC_API_URL as string);

function Feed() {
  const router: NextRouter = useRouter();
  const user = useSelector(selectUser);
  const posts = useSelector(selectPosts);
  const dispatch = useDispatch();
  const [showCreatePostModal, setShowCreatePostModal] =
    useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const { data } = await getCurrentUser();
      dispatch(setUser(data.user));
    } catch (error: any) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (payload: postInterface, isNew: Boolean) => {
    try {
      if (!posts) return;
      let newPosts;
      if (isNew) {
        newPosts = [...posts, payload];
      } else {
        newPosts = posts.map((post) =>
          post._id === payload._id ? { ...payload } : post
        );
      }
      dispatch(setPosts(newPosts));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  const handlePostShare = async (postId: string) => {
    try {
      if (!posts) return;
      const newPosts: postInterface[] = posts.map((post) => {
        if (post._id === postId) {
          post = { ...post, shares: post.shares + 1 };
          return post;
        } else {
          return post;
        }
      });
      dispatch(setPosts(newPosts));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const { data } = await getAllPosts();
      dispatch(setPosts(data.posts));
    } catch (error: any) {
      toast.error("cannot fetch posts at the moment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchAllPosts();
  }, []);

  useEffect(() => {
    socket.on("postNew", (payload: postInterface) => handlePost(payload, true));
    socket.on("postUpdate", (payload: postInterface) =>
      handlePost(payload, false)
    );
    socket.on("postShared", (postId: string) => handlePostShare(postId));
  });

  return loading ? (
    <Loader />
  ) : (
    user && (
      <section className="feed">
        {showCreatePostModal && (
          <PostModal setShowCreatePostModal={setShowCreatePostModal} />
        )}

        <Header setShowCreatePostModal={setShowCreatePostModal} />
        <div className="container">
          <div className="feed__left">
            {posts &&
              posts
                .slice()
                .sort(function (a: any, b: any) {
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                })
                .map((post: postInterface) => (
                  <FeedPost
                    post={post}
                    user={user}
                    final={false}
                    key={post._id}
                  />
                ))}
          </div>

          <div className="feed__right">
            <div className="content">
              <div className="top">
                <Image
                  src={
                    user?.avatar?.secure_url
                      ? user.avatar.secure_url
                      : "/images/dummy_avatar.png"
                  }
                  alt="avatar"
                  height={55}
                  width={55}
                  objectFit="cover"
                  layout="fixed"
                />
                <p>{user.name}</p>
              </div>
              <div className="bottom">
                <Link href={`/profile/${user._id}`}>
                  <a className="btn-brand">
                    Profile
                    <FaUserAlt />
                  </a>
                </Link>
              </div>
            </div>
            <p className="joined">
              <span>Joined on</span> : {moment(user.createdAt).format("L")}
            </p>
            <button
              className="create-post btn-brand"
              onClick={() => setShowCreatePostModal(true)}
            >
              Create Post <FaPlus />
            </button>
          </div>
        </div>
      </section>
    )
  );
}

export default Feed;
