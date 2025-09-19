'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  DashboardOutlined,
  EventOutlined,
  CalendarMonthOutlined,
  BarChart,
  Domain,
  PeopleAltOutlined,
  ApartmentOutlined,
  MailOutline,

} from '@mui/icons-material';
import { useAuth } from '@/hooks/auth';
import { useMemo } from 'react';

const links = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: DashboardOutlined,
    roles: []
  },
  {
    name: 'Mis Posts',
    href: '/mis-posts',
    icon: MailOutline,
    roles: ['creador']
  }
];

export default function NavLinks() {
  const pathname = usePathname();

  const { user } = useAuth({ middleware: 'auth' });

  const navItems = useMemo(() => {
    return links.map((link) => {

      if (!user) return

      const canRenderItem = !link.roles.length || user.roles?.some(role => link.roles.includes(role.name))

      if (!canRenderItem) return null

      const LinkIcon = link.icon;
      return (
        <Link
          key={link.name}
          href={link.href}
          className={clsx(
            'flex h-[48px] items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-regal-blue text-base font-medium hover:bg-slate-200 md:flex-none md:p-2 md:px-3 transition-all',
            {
              'bg-slate-200 hover:bg-slate-200 text-blue-600': pathname === link.href,
            },
          )}
        >
          <LinkIcon className="w-7" />
          <h1 className="text-lg font-medium">{link.name}</h1>
        </Link>
      );
    })
  }, [user, pathname])

  return (
    <>
      {navItems}
    </>
  );
}
