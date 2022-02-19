import type { NextPage } from "next";
import Head from "next/head";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import HomeHeader from "../components/HomeHeader";
import { NextRouter, useRouter } from "next/router";
import { getCurrentUser } from "../utils/api";
import { selectIsLoggedIn, setUser } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Home: NextPage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const router: NextRouter = useRouter();

  const fetchUser = async () => {
    if (isLoggedIn) {
      router.push("/feed");
    } else {
      try {
        const { data } = await getCurrentUser();
        dispatch(setUser(data.user));
        router.push("/feed");
      } catch (error: any) {
        return;
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <HomeHeader />
      <section className="home">
        <Head>
          <title>SmilyWeb | Welcome</title>
          <meta
            name="description"
            content="social media application build with next.js"
          />
          {/* <link rel="icon" href="/favicon.ico" /> */}
        </Head>

        <div className="container">
          <div className="home__left">
            <h1 className="home__heading">Go Social with SmilyWeb</h1>
            <p className="home__text">
              SmilyWeb gives you hands on experience of a fully fledged
              socialmedia application.
            </p>
            <button
              className="btn-brand"
              onClick={() => router.push("/auth/register")}
            >
              <span>Connect now</span>
              <FaArrowRight />
            </button>
          </div>

          <div className="home__right">
            <Image src="/images/home.svg" height={520} width={520} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
