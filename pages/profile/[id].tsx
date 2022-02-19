import Image from "next/image";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { FaExternalLinkAlt, FaTools, FaUnlockAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import PostModal from "../../components/PostModal";
import { postInterface } from "../../slices/postSlice";
import { selectUser, setUser, userInterface } from "../../slices/userSlice";
import {
  doFollowUser,
  doUnFollowUser,
  getCurrentUser,
  getSingleUser,
  getUserAllPosts,
} from "../../utils/api";

const singleUser = () => {
  const alert = useAlert();
  const router: NextRouter = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [posts, setPosts] = useState<postInterface[] | []>([]);
  const [targetedUser, setTargetedUser] = useState<userInterface | null>(null);
  const [showCreatePostModal, setShowCreatePostModal] =
    useState<Boolean>(false);
  const [isFollowing, setIsFollowing] = useState<Boolean>(false);

  const userId = (
    typeof window !== "undefined" && window.location.href
      ? window.location.href
      : ""
  ).split("/profile/")[1];

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const fetchCurrentUser = async () => {
    try {
      const { data } = await getCurrentUser();
      dispatch(setUser(data.user));
    } catch (error: any) {
      router.push("/auth/login");
    }
  };

  const fetchTargetedUser = async () => {
    try {
      const { data } = await getSingleUser(userId);
      setTargetedUser(data.user);
    } catch (error: any) {
      alert.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  const fetchUserAllPosts = async (id: string) => {
    try {
      const { data } = await getUserAllPosts(id);
      setPosts(data.posts);
    } catch (error: any) {
      setPosts([]);
      alert.error("cannot fetch posts at the moment");
    }
  };

  const followUser = async () => {
    try {
      const { data } = await doFollowUser(userId);
      alert.success(data.message);
      setIsFollowing(true);
    } catch (error: any) {
      alert.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  const unFollowUser = async () => {
    try {
      const { data } = await doUnFollowUser(userId);
      alert.success(data.message);
      setIsFollowing(false);
    } catch (error: any) {
      alert.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchTargetedUser();
    fetchUserAllPosts(userId);
  }, []);

  useEffect(() => {
    if (targetedUser && user)
      targetedUser.followers.find((follower) => follower.user === user._id)
        ? setIsFollowing(true)
        : setIsFollowing(false);
  }, [targetedUser]);

  return (
    targetedUser &&
    user && (
      <section className="profile">
        {showCreatePostModal && (
          <PostModal setShowCreatePostModal={setShowCreatePostModal} />
        )}
        <Header setShowCreatePostModal={setShowCreatePostModal} />
        <div className="container">
          <div className="profile__userDetails">
            <div className="profile__userDetails__left">
              <Image
                src={
                  targetedUser.avatar.secure_url !== ""
                    ? targetedUser.avatar.secure_url
                    : "/images/dummy_avatar.png"
                }
                height={250}
                width={250}
              />
            </div>
            <div className="profile__userDetails__right">
              <h2 className="user-name">{targetedUser.name}</h2>
              <div className="user-stats">
                <p className="posts">
                  {posts.length} {posts.length > 1 ? "posts" : "post"}
                </p>
                <p className="followers">
                  {targetedUser.followers.length} followers
                </p>
                <p className="posts">
                  {targetedUser.following.length} following
                </p>
              </div>
              <div className="edit-buttons">
                {user._id === targetedUser._id ? (
                  <>
                    <Link href="/profile/update">
                      <a className="btn-brand">
                        Edit Profile <FaTools />
                      </a>
                    </Link>
                    {!targetedUser.isLoggedInWithGoogle && (
                      <Link href="/auth/updatepassword">
                        <a className="btn-brand">
                          Update Password <FaUnlockAlt />
                        </a>
                      </Link>
                    )}
                  </>
                ) : isFollowing ? (
                  <button className="btn-brand" onClick={unFollowUser}>
                    Unfollow
                  </button>
                ) : (
                  <button className="btn-brand" onClick={followUser}>
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="profile__userPosts">
            <h2>Posts</h2>
            <div className="profile__userPosts__allPosts">
              {posts && posts.length ? (
                <div className="profile__posts">
                  {posts.map((post) => (
                    <div className="postImages">
                      <img
                        src={post.image.secure_url}
                        alt="post"
                        key={post._id}
                        loading="lazy"
                      />
                      <Link href={`${origin}/post/${post._id}`}>
                        <a className="link">
                          <FaExternalLinkAlt />
                          <span>View Post</span>
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>don't have any post to show</p>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default singleUser;
