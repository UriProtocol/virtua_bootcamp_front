'use client'
import React from "react";
import { Link } from "@nextui-org/link";
import AuthCard from "./AuthCard";
import ApplicationLogo from "./ApplicationLogo";
import LoginForm from "./LoginForm"
// const backgroundImage = 'url(/fondo.jpg)';

export default function LoginPage() {
  return (
    // <div style={{ backgroundImage }} className="h-full lg:px-6">
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          <AuthCard
            logo={
              <Link href="/">
                <ApplicationLogo className="min-w-[120px] pb-10 pt-5" />
              </Link>
            }
          >
            <LoginForm />
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
