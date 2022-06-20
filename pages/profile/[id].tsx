import Image from "next/image";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaExternalLinkAlt, FaTools, FaUnlockAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
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

const SingleUser = () => {
  const router: NextRouter = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [posts, setPosts] = useState<postInterface[] | []>([]);
  const [targetedUser, setTargetedUser] = useState<userInterface | null>(null);
  const [showCreatePostModal, setShowCreatePostModal] =
    useState<Boolean>(false);
  const [isFollowing, setIsFollowing] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);

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
      setLoading(true);
      const { data } = await getCurrentUser();
      dispatch(setUser(data.user));
    } catch (error: any) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchTargetedUser = async () => {
    try {
      setLoading(true);
      const { data } = await getSingleUser(userId);
      setTargetedUser(data.user);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAllPosts = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await getUserAllPosts(id);
      setPosts(data.posts);
    } catch (error: any) {
      setPosts([]);
      toast.error("cannot fetch posts at the moment");
    } finally {
      setLoading(false);
    }
  };

  const followUser = async () => {
    try {
      setLoading(true);
      const { data } = await doFollowUser(userId);
      toast.success(data.message);
      setIsFollowing(true);
      fetchTargetedUser();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const unFollowUser = async () => {
    try {
      setLoading(true);
      const { data } = await doUnFollowUser(userId);
      toast.success(data.message);
      setIsFollowing(false);
      fetchTargetedUser();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchUserAllPosts(userId);
  }, []);

  useEffect(() => {
    fetchTargetedUser();
  }, [userId]);

  useEffect(() => {
    if (targetedUser && user)
      targetedUser.followers.find((follower) => follower.user === user._id)
        ? setIsFollowing(true)
        : setIsFollowing(false);
  }, [targetedUser]);

  return loading ? (
    <Loader />
  ) : (
    targetedUser && user && (
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
                  {targetedUser.followers.length}{" "}
                  {targetedUser.followers.length > 1 ? "followers" : "follower"}
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
                    <div className="postImages" key={post._id}>
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
                <p>{"don't have any post to show"}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default SingleUser;
