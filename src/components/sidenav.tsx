import { useState } from 'react';
import Link from 'next/link';
import NavLinks from '@/components/nav-links';
import { Image } from "@nextui-org/image";
import clsx from 'clsx';
import { ChevronLeftRounded } from '@mui/icons-material';
import { Button } from "@nextui-org/react";

export default function SideNav() {
  return (
    <aside className={`flex h-full flex-col w-72 bg-white transition-all duration-300`}>
      <div className="flex flex-row w-full justify-center items-center h-20 shadow">
        <Link
          className=""
          href="/"
        >
          <Image
            width={150}
            alt="Virtua logo"
            src="/images/virtua.png"
            radius='none'
          />
        </Link>
      </div>

      <div className="flex flex-col justify-start px-2 py-2 gap-2">
        <NavLinks />
      </div>
    </aside>
  );
}
