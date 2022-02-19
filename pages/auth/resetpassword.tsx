import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import { useForm } from "react-hook-form";
import { loginUser } from "../../utils/api";
import { useRouter } from "next/router";
import { FaLock, FaUnlockAlt } from "react-icons/fa";

const resetPasswordSchema = object({
  newPassword: string({
    required_error: "please provide new password",
  })
    .nonempty("password is required")
    .min(6, "new password should be atleast 6 characters long"),
  confirmNewPassword: string({
    required_error: "please provide confirm new password",
  }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "new password field dosen't matches with the confirm new password",
  path: ["confirmNewPassword"],
});

export type resetPasswordInput = TypeOf<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const router = useRouter();
  const [resetError, setResetError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: resetPasswordInput) => {
    try {
      //   const { data } = await loginUser(values);
      //   console.log(data);
      router.push("/auth/login");
    } catch (error: any) {
      setResetError(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  return (
    <section className="auth">
      <div className="container">
        <div className="content">
          <h1 className="heading-brand">SmilyWeb</h1>
          <p>{resetError && resetError}</p>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              <p>{errors.newPassword?.message}</p>
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
