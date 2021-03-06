import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShareAlt,
  FaArrowRight,
  FaRocketchat,
  FaPaperPlane,
  FaShareSquare,
} from "react-icons/fa";
import { socket } from "../pages/feed";
import { Comment, postInterface } from "../slices/postSlice";
import { userInterface } from "../slices/userSlice";
import { disLikePost, likePost, makeComment, sharePost } from "../utils/api";
import SingleComment from "./SingleComment";

const FeedPost = (props: {
  post: postInterface;
  user: userInterface;
  final: Boolean;
}) => {
  const { post, user } = props;
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [toggleLike, setToggleLike] = useState<Boolean>(false);
  const [showLike, setShowLike] = useState<Boolean>(false);
  const [showAllComments, setShowAllComments] = useState<Boolean>(false);

  const addComment = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!commentInputRef.current?.value) return;
      const { data } = await makeComment(post._id, {
        comment: commentInputRef.current?.value,
      });
      commentInputRef.current.value = "";
      toast.success(data.message);
      socket.emit("postUpdate", data.updatedPost);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  const handleShare = async () => {
    try {
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : "";
      navigator.clipboard.writeText(`${origin}/post/${post._id}`);
      const { data } = await sharePost(post._id);
      socket.emit("postShared", post._id);
      toast.success(data.message);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await likePost(post._id);
      setShowLike(true);
      setToggleLike(true);
      toast.success(data.message);
      if (data.message === "already liked") return;
      socket.emit("postUpdate", data.updatedPost);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  const handleDisLike = async () => {
    try {
      const { data } = await disLikePost(post._id);
      toast.success(data.message);
      setToggleLike(false);
      socket.emit("postUpdate", data.updatedPost);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  useEffect(() => {
    post.likes.find((like) => like.user === user._id)
      ? setToggleLike(true)
      : setToggleLike(false);
  });

  return (
    post && (
      <article className="feedPost">
        <div className="feedPost__header">
          <div className="top">
            <div className="left">
              <Link href={`/profile/${post.postCreator._id}`}>
                <a>
                  <Image
                    src={
                      post.postCreator?.avatar?.secure_url
                        ? post.postCreator.avatar.secure_url
                        : "/images/dummy_avatar.png"
                    }
                    alt={post.postCreator.name}
                    height={40}
                    width={40}
                    className="feedPost__avatar"
                    objectFit="cover"
                    loading="lazy"
                  />
                </a>
              </Link>
              <p>{post.postCreator.name.split(" ")[0]}</p>
            </div>
            <div className="right">{moment(post.createdAt).format("lll")}</div>
          </div>
          <div className="caption">
            <FaArrowRight className="caption__icon" />
            <p className="caption__text">{post.caption}</p>
            {!props.final && (
              <Link href={`/post/${post._id}`}>
                <a>
                  <FaShareSquare className="caption__redirect" />
                </a>
              </Link>
            )}
          </div>
        </div>

        <div className="feedPost__body">
          <img
            className="feedPost__image"
            src={post.image.secure_url}
            alt="post"
            loading="lazy"
            onDoubleClick={handleLike}
          />
          <span
            className={`heart ${showLike ? "show" : ""}`}
            onTransitionEnd={() => setShowLike(false)}
          >
            <FaHeart color="red" />
          </span>
        </div>

        <div className="feedPost__footer">
          <div className="actions">
            <p className="like">
              {toggleLike ? (
                <FaHeart className="red" onClick={handleDisLike} />
              ) : (
                <FaRegHeart onClick={handleLike} />
              )}
              <span>
                {post.likes.length} {post.likes.length > 1 ? "likes" : "like"}
              </span>
            </p>
            <p className="comment">
              <FaComment />
              <span>
                {post.comments.length}{" "}
                {post.comments.length > 1 ? "comments" : "comment"}
              </span>
            </p>
            <p className="share">
              <FaShareAlt onClick={handleShare} />
              <span>
                {post.shares} {Number(post.shares) > 1 ? "shares" : "share"}
              </span>
            </p>
          </div>
          {post.comments.length !== 0 && (
            <>
              <div className="comments">
                {!showAllComments
                  ? post.comments.map((comment: Comment, index: number) => {
                      if (index > 1) return;
                      return (
                        <SingleComment
                          comment={comment}
                          user={user}
                          key={`comment-${index}`}
                        />
                      );
                    })
                  : post.comments.map((comment: Comment, index: number) => (
                      <SingleComment
                        comment={comment}
                        user={user}
                        key={`comment-${index}`}
                      />
                    ))}
                {post.comments.length > 2 && (
                  <button
                    className="btn-brand"
                    onClick={() => setShowAllComments(!showAllComments)}
                  >
                    {showAllComments ? "view less" : "view all"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        <form className="feedPost__addComment" onSubmit={addComment}>
          <FaRocketchat className="chatIcon" />
          <input
            type="text"
            ref={commentInputRef}
            placeholder="Add a comment"
          />
          <button type="submit">
            <FaPaperPlane />
          </button>
        </form>
      </article>
    )
  );
};

export default FeedPost;
