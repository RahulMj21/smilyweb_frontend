import Image from "next/image";
import React, { useRef, useState } from "react";
import { useAlert } from "react-alert";
import { FaFileImage, FaHandPointRight, FaTimes } from "react-icons/fa";
import { createPost } from "../utils/api";
import { socket } from "../pages/feed";
import Loader from "./Loader";

const PostModal = (props: { setShowCreatePostModal: Function }) => {
  const alert = useAlert();
  const fileRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<Boolean>(false);
  const [postImage, setPostImage] = useState<string | ArrayBuffer | null>(null);

  const createPostImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files: File[] = Array.from(
        e.target.files as Iterable<File> | ArrayLike<File>
      );
      if (!files) return;

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = function () {
        setPostImage(reader.result);
      };
    } catch (error: any) {
      alert.error(error.message);
    }
  };

  const submitPost = async () => {
    try {
      setLoading(true);
      if (!captionRef.current?.value || !postImage) return;
      const { data } = await createPost({
        image: postImage as string,
        caption: captionRef.current?.value,
      });
      alert.success(data.message);
      socket.emit("postNew", data.post);
    } catch (error: any) {
      alert.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setLoading(false);
      props.setShowCreatePostModal(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="modal">
      <div
        className="overlay"
        onClick={() => props.setShowCreatePostModal(false)}
      />
      <FaTimes
        className="modal__close"
        onClick={() => props.setShowCreatePostModal(false)}
      />
      <div className="container">
        <div className="content">
          {!postImage ? (
            <>
              <h2 className="modal__heading">First Select an Image to Post</h2>
              <button
                className="btn-brand"
                onClick={() => fileRef.current?.click()}
              >
                Choose an Image
                <FaFileImage />
              </button>
              <input
                type="file"
                ref={fileRef}
                onChange={createPostImage}
                hidden
                accept="image/*"
              />
            </>
          ) : (
            <>
              <h2 className="modal__heading">Create Post</h2>
              <Image
                src={postImage as string}
                height={150}
                width={250}
                objectFit="contain"
              />
              <div className="modal__inputGroup">
                <FaHandPointRight />
                <input
                  type="text"
                  placeholder="Write a Caption"
                  ref={captionRef}
                />
                <button className="btn-brand" onClick={submitPost}>
                  Post
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostModal;
