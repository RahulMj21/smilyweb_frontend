import React from "react";
import { NextRouter, useRouter } from "next/router";
import Link from "next/link";

const HomeHeader = () => {
  const router: NextRouter = useRouter();
  return (
    <header className="homeHeader">
      <div className="container">
        <div className="homeHeader__logo">
          <Link href="/">
            <a translate="no">SmilyWeb</a>
          </Link>
        </div>
        <div className="homeHeader__buttons">
          <div
            className="btn-outlined"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </div>
          <div className="btn-brand" onClick={() => router.push("/auth/login")}>
            Login
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
