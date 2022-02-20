import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FaUserCircle, FaEnvelope, FaLock, FaUnlockAlt } from "react-icons/fa";
import Link from "next/link";
import { getCurrentUser, registerUser } from "../../utils/api";
import { useRouter } from "next/router";
import showConcentScreen from "../../utils/showConcentScreen";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/userSlice";
import { useAlert } from "react-alert";
import Loader from "../../components/Loader";

const createUserSchema = object({
  name: string({
    required_error: "please provide your name",
  }).nonempty("please enter your name"),
  email: string({
    required_error: "please provide your name",
  })
    .email("please enter a valid email")
    .nonempty("please enter an email"),
  password: string({
    required_error: "please provide password",
  })
    .min(6, "password is too short")
    .nonempty("password is required"),
  confirmPassword: string({
    required_error: "please provide confirm password",
  }).nonempty("password confirmation is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "password field dosen't matches with the confirm password field",
  path: ["confirmPassword"],
});

export type createUserInput = TypeOf<typeof createUserSchema>;

const Register = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState<Boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (values: createUserInput) => {
    try {
      setLoading(true);
      const { data } = await registerUser(values);
      dispatch(setUser(data.user));
      alert.success(data.message);
      router.push("/feed");
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
              <FaUserCircle />
              <input
                type="text"
                id="name"
                {...register("name")}
                placeholder="Enter your name"
              />
              <p>{errors.name?.message}</p>
            </div>
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
            <div className="input-group">
              <FaUnlockAlt />
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Enter Confirm password"
              />
              <p>{errors.confirmPassword?.message}</p>
            </div>
            <button type="submit" className="btn-brand">
              Register
            </button>
          </form>
          <p className="toggle-form">
            <span>Allready have an account?</span>
            <Link href="/auth/login">
              <a>Login</a>
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

export default Register;
