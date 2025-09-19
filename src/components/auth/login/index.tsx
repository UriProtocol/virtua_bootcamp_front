import React from "react";
import { Link } from "@nextui-org/link";
import AuthCard from "./AuthCard";
import ApplicationLogo from "./ApplicationLogo";
import LoginForm from "./LoginForm"
// const backgroundImage = 'url(/fondo.jpg)';

export default function LoginPage() {
  return (
    // <div style={{ backgroundImage }} className="h-full lg:px-6">
    <AuthCard
      logo={
        <Link href="/">
          <ApplicationLogo className="min-w-[120px] pb-10 pt-5" />
        </Link>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
