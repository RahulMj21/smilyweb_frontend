import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { FaTools, FaFolderPlus, FaFileImage } from "react-icons/fa";
import PostModal from "../../components/PostModal";
import { NextRouter, useRouter } from "next/router";
import { selectUser, setUser } from "../../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  updateUserAvatar,
  updateUserInfo,
} from "../../utils/api";
import { useAlert } from "react-alert";

const UpdateProfile = () => {
  const user = useSelector(selectUser);
  const alert = useAlert();
  const router: NextRouter = useRouter();
  const dispatch = useDispatch();

  const selectImageRef = useRef<HTMLInputElement>(null);

  const [showCreatePostModal, setShowCreatePostModal] =
    useState<Boolean>(false);
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [updateImage, setUpdateImage] = useState<string | ArrayBuffer | null>(
    null
  );

  const handleUpdateInfo = async () => {
    try {
      if (user !== null) {
        if (!name && !email) return alert.info("nothing to change");
        const { data } = await updateUserInfo({
          name: name ? name : user.name,
          email: email ? email : user.email,
        });
        alert.success(data.message);
        router.push("/profile/me");
      }
    } catch (error: any) {
      alert.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };
  const handleUpdateAvatar = async () => {
    try {
      const { data } = await updateUserAvatar(updateImage as string);
      alert.success(data.message);
      router.push("/profile/me");
    } catch (error: any) {
      alert.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  const createUpdateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(
      e.target.files as Iterable<File> | ArrayLike<File>
    );
    if (!files) return;

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = function () {
      setUpdateImage(reader.result);
    };
  };

  const fetchCurrentUser = async () => {
    try {
      const { data } = await getCurrentUser();
      dispatch(setUser(data.user));
    } catch (error: any) {
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [!user]);

  return (
    user && (
      <section className="profile">
        {showCreatePostModal && (
          <PostModal setShowCreatePostModal={setShowCreatePostModal} />
        )}
        <Header setShowCreatePostModal={setShowCreatePostModal} />
        <div className="container">
          <h1 className="section-heading">Update Profile</h1>
          <div className="profile__userDetails">
            <div className="profile__userDetails__left">
              <div className="image">
                <img
                  src={
                    updateImage
                      ? (updateImage as string)
                      : user.avatar.secure_url
                      ? user.avatar.secure_url
                      : "/images/dummy_avatar.png"
                  }
                  loading="lazy"
                />
                <input
                  type="file"
                  hidden
                  ref={selectImageRef}
                  onChange={createUpdateImage}
                />
                <div className="overlay">
                  <FaFolderPlus
                    onClick={() => selectImageRef.current?.click()}
                  />
                </div>
              </div>
              {updateImage && (
                <button className="btn-brand" onClick={handleUpdateAvatar}>
                  Update Avatar <FaFileImage />
                </button>
              )}
            </div>

            <div className="profile__userDetails__right">
              <div className="user-inputs">
                <div className="input-group">
                  <label htmlFor="name">Update Name :</label>
                  <input
                    id="name"
                    className="user-input"
                    placeholder={user.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="email">Update Email :</label>
                  <input
                    id="email"
                    className="user-input"
                    placeholder={user.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="edit-buttons">
                <button className="btn-brand" onClick={handleUpdateInfo}>
                  Update Info
                  <FaTools />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default UpdateProfile;
