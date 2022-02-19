import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { getCurrentUser, loginUser } from "../../utils/api";
import { useRouter } from "next/router";
import showConcentScreen from "../../utils/showConcentScreen";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { setUser } from "../../slices/userSlice";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";

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

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const alert = useAlert();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = async (values: loginUserInput) => {
    try {
      const { data } = await loginUser(values);
      dispatch(setUser(data.user));
      alert.success(data.message);
      router.push("/feed");
    } catch (error: any) {
      alert.error(
        error.response?.data?.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const { data } = await getCurrentUser();
      if (data) router.push("/feed");
    } catch (error: any) {
      return;
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
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
            <div className="input-group">
              <FaLock />
              <input
                type="password"
                id="password"
                {...register("password")}
                placeholder="Enter password"
              />
              <p>{errors.password?.message}</p>
            </div>
            <button type="submit" className="btn-brand">
              Login
            </button>
          </form>
          <p className="forgot-password">Forgot Password ?</p>
          <p className="toggle-form">
            <span>Don't have an account ?</span>
            <Link href="/auth/register">
              <a>Register</a>
            </Link>
          </p>
          <p className="or">OR</p>
          <Link href={showConcentScreen()}>
            <a className="google-btn">
              <FcGoogle />
              Continue with Google
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
