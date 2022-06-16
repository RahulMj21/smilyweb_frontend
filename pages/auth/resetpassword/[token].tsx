import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import { useForm } from "react-hook-form";
import { resetPassword } from "../../../utils/api";
import { NextRouter, useRouter } from "next/router";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import { AlertManager, useAlert } from "react-alert";
import Loader from "../../../components/Loader";

const resetPasswordSchema = object({
  password: string({
    required_error: "please provide new password",
  })
    .nonempty("password is required")
    .min(6, "new password should be atleast 6 characters long"),
  confirmPassword: string({
    required_error: "please provide confirm new password",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "password field dosen't matches with the confirm password",
  path: ["confirmNewPassword"],
});

export type resetPasswordInput = TypeOf<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const alert: AlertManager = useAlert();
  const router: NextRouter = useRouter();

  const [loading, setLoading] = useState<Boolean>(false);

  const token = router.query.token as string;

  // const token = (
  //   typeof window !== "undefined" && window.location.href
  //     ? window.location.href
  //     : ""
  // ).split("/auth/resetpassword/")[1];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (input: resetPasswordInput) => {
    try {
      setLoading(true);
      const { data } = await resetPassword(token, input);
      alert.success(data.message);
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
    <section className="auth">
      <div className="container">
        <div className="content">
          <h1 className="heading-brand">SmilyWeb</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group">
              <FaLock />
              <input
                type="password"
                id="password"
                {...register("password")}
                placeholder="Enter new password"
              />
              <p>{errors.password?.message}</p>
            </div>
            <div className="input-group">
              <FaUnlockAlt />
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Enter confirm new password"
              />
              <p>{errors.password?.message}</p>
            </div>
            <button type="submit" className="btn-brand">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
