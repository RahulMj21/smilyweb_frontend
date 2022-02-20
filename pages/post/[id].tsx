import Image from "next/image";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AlertManager, useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import FeedPost from "../../components/FeedPost";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import PostModal from "../../components/PostModal";
import { postInterface } from "../../slices/postSlice";
import { selectUser, setUser, userInterface } from "../../slices/userSlice";
import { getCurrentUser, getSinglePost } from "../../utils/api";
import { socket } from "../feed";

const singlePost = () => {
  const alert: AlertManager = useAlert();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const router: NextRouter = useRouter();
  const [post, setPost] = useState<postInterface | null>(null);
  const [showCreatePostModal, setShowCreatePostModal] =
    useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);

  const id =
    typeof window !== "undefined" && window.location.href
      ? window.location.href.toString().split("/post/")[1]
      : "";

  const fetchSinglePost = async () => {
    try {
      setLoading(true);
      const { data } = await getSinglePost(id as string);
      setPost(data.post);
    } catch (error: any) {
      alert.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const {
        data,
      }: { data: { status: number; message: string; user: userInterface } } =
        await getCurrentUser();
      dispatch(setUser(data.user));
    } catch (error: any) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSinglePost();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    socket.on("postUpdate", (payload: postInterface) => fetchSinglePost());
    socket.on("postShared", (postId: string) => fetchSinglePost());
  });

  return loading ? (
    <Loader />
  ) : (
    post && user && (
      <section className="singlePost">
        {showCreatePostModal && (
          <PostModal setShowCreatePostModal={setShowCreatePostModal} />
        )}
        <Header setShowCreatePostModal={setShowCreatePostModal} />
        <div className="container">
          <FeedPost post={post} user={user} final={true} />
        </div>
      </section>
    )
  );
};

export default singlePost;
