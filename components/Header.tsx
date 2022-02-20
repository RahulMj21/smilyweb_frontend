import Link from "next/link";
import Router, { NextRouter, useRouter } from "next/router";
import React, { useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectUser } from "../slices/userSlice";
import { logoutUser } from "../utils/api";
import Loader from "./Loader";

const Header = (props: { setShowCreatePostModal: Function }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const alert = useAlert();
  const router: NextRouter = useRouter();

  const [loading, setLoading] = useState<Boolean>(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { data } = await logoutUser();
      alert.success(data.message);
      dispatch(clearUser());
      router.push("/auth/login");
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

  return loading ? (
    <Loader />
  ) : (
    user && (
      <header className="header">
        <div className="container">
          <div className="homeHeader__logo">
            <Link href="/">
              <a translate="no">SmilyWeb</a>
            </Link>
          </div>
          <div className="header__list">
            <Link href="/feed">
              <a>Feed</a>
            </Link>
            <span
              className="header-link"
              onClick={() => props.setShowCreatePostModal(true)}
            >
              Create
            </span>
            <Link href={`/profile/${user._id}`}>
              <a>Profile</a>
            </Link>
            <div className="btn-brand" onClick={handleLogout}>
              Log Out
            </div>
          </div>
        </div>
      </header>
    )
  );
};

export default Header;
