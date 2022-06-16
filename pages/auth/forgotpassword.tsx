import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { getCurrentUser, forgotPassword } from "../../utils/api";
import { useRouter } from "next/router";
import showConcentScreen from "../../utils/showConcentScreen";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { setUser } from "../../slices/userSlice";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import Loader from "../../components/Loader";

const loginUserSchema = object({
  email: string({
    required_error: "please provide your name",
  })
    .email("please enter a valid email")
    .nonempty("please enter an email"),
  password: string({
    required_error: "please provide password",
  }).nonempty("password is required"),
});

export type loginUserInput = TypeOf<typeof loginUserSchema>;

const ForgotPasswordSchema = object({
  email: string({
    required_error: "please provide your name",
  })
    .email("please enter a valid email")
    .nonempty("please enter an email"),
});
export type ForgotPasswordInput = TypeOf<typeof ForgotPasswordSchema>;

const ForgotPassword = () => {
  const router = useRouter();
  const alert = useAlert();

  const [loading, setLoading] = useState<Boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (input: { email: string }) => {
    try {
      setLoading(true);
      const { data }: { data: { success: boolean; message: string } } =
        await forgotPassword(input);
      if (data.success) {
        alert.success(data.message);
      }
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
      if (data) router.push("/feed");
    } catch (error: any) {
      return;
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
    <section className="auth">
      <div className="container">
        <div className="content">
          <h1 className="heading-brand">SmilyWeb</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group">
              <FaEnvelope />
              <input
                type="text"
                id="email"
                {...register("email")}
                placeholder="Enter your email"
              />
              <p>{errors.email?.message}</p>
            </div>
            <button type="submit" className="btn-brand">
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
