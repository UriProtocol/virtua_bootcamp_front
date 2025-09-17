'use client';
import Link from 'next/link';
import {usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  DashboardOutlined,
  EventOutlined,
  CalendarMonthOutlined,
  BarChart,
  Domain,
  PeopleAltOutlined,
  ApartmentOutlined,
} from '@mui/icons-material';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardOutlined,},
  {
    name: 'Usuarios',
    href: '/usuarios',
    icon: PeopleAltOutlined,
  }
];

export default function NavLinks({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-regal-blue text-base font-medium hover:bg-slate-300 md:flex-none md:p-2 md:px-3',
              {
                'bg-slate-400 text-blue-600': pathname === link.href,
                'justify-center': collapsed,
              },
            )}
          >
            <LinkIcon className="w-7" />
            {!collapsed && <p className="pt-1 pl-1">{link.name}</p>}
          </Link>
        );
      })}
    </>
  );
}
