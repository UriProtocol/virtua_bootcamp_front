import { useState } from 'react';
import Link from 'next/link';
import NavLinks from '@/components/nav-links';
import { Image } from "@nextui-org/image";
import clsx from 'clsx';
import { ChevronLeftRounded } from '@mui/icons-material';
import { Button } from "@nextui-org/react";

export default function SideNav({ onCollapse }: { onCollapse: (collapsed: boolean) => void }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    onCollapse(!collapsed);
  };

  return (
    <aside className={`flex h-full flex-col ${collapsed ? 'w-16' : 'w-64'} bg-white transition-all duration-300`}>
      
        <div className="flex flex-row w-full justify-between">
          {!collapsed && (
            <Link
              className="mb-2 flex h-20 items-end justify-start rounded-md p-4"
              href="/"
            >
              <Image
                width={150}
                alt="Virtua logo"
                src="/images/virtua.png"
                radius='none'
              />
            </Link>
          )}
          <div className={`content-center ${collapsed ? 'p-1 ml-2' : 'h-20'}`}>
            <Button
              isIconOnly
              className="bg-white hover:bg-delta-blue"
              onPress={toggleCollapse}
            >
              <ChevronLeftRounded className={`text-xl text-black ${collapsed ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-start space-y-2">
          <NavLinks collapsed={collapsed}/>
        </div>
      
    </aside>
  );
}
