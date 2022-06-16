import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import { useForm } from "react-hook-form";
import { getCurrentUser, updatePassword } from "../../utils/api";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import { useAlert } from "react-alert";
import { NextRouter, useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../slices/userSlice";
import Header from "../../components/Header";
import PostModal from "../../components/PostModal";
import Loader from "../../components/Loader";

const updatePasswordSchema = object({
  currentPassword: string({
    required_error: "please provide current password",
  }).nonempty("current password is required"),
  newPassword: string({
    required_error: "please provide new password",
  })
    .nonempty("new password is required")
    .min(6, "new password should be atleast 6 characters long"),
  confirmNewPassword: string({
    required_error: "please provide confirm new password",
  }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "new password dosen't matches with the confirm new password",
  path: ["confirmNewPassword"],
});

export type updatePasswordInput = TypeOf<typeof updatePasswordSchema>;

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const router: NextRouter = useRouter();
  const user = useSelector(selectUser);
  const alert = useAlert();
  const [showCreatePostModal, setShowCreatePostModal] =
    useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<updatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (values: updatePasswordInput) => {
    try {
      if (!user) return;
      setLoading(true);
      const { data } = await updatePassword(values);
      alert.success(data.message);
      router.push(`/profile/${user._id}`);
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
      const { data } = await getCurrentUser();
      dispatch(setUser(data.user));
    } catch (error: any) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      {showCreatePostModal && (
        <PostModal setShowCreatePostModal={setShowCreatePostModal} />
      )}

      <Header setShowCreatePostModal={setShowCreatePostModal} />
      <section className="auth">
        <div className="container">
          <div className="content">
            <h1 className="heading-brand">SmilyWeb</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group">
                <FaLock />
                <input
                  type="password"
                  id="currentPassword"
                  {...register("currentPassword")}
                  placeholder="Enter current password"
                />
                <p>{errors.currentPassword?.message}</p>
              </div>
              <div className="input-group">
                <FaLock />
                <input
                  type="password"
                  id="newPassword"
                  {...register("newPassword")}
                  placeholder="Enter new password"
                />
                <p>{errors.newPassword?.message}</p>
              </div>
              <div className="input-group">
                <FaUnlockAlt />
                <input
                  type="password"
                  id="confirmNewPassword"
                  {...register("confirmNewPassword")}
                  placeholder="Enter confirm new password"
                />
                <p>{errors.confirmNewPassword?.message}</p>
              </div>
              <button type="submit" className="btn-brand">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdatePassword;
