"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

/*
Given the guestRoutes in sidebar-routes.tsx:

Sidebar Item 1: href="/" (Dashboard)
Sidebar Item 2: href="/search" (Browse)
Example 1: Current Pathname is /
Sidebar Item 1: isActive will be true because pathname === "/" && href === "/".
Sidebar Item 2: isActive will be false.
Example 2: Current Pathname is /search
Sidebar Item 1: isActive will be false.
Sidebar Item 2: isActive will be true because pathname === href.
Example 3: Current Pathname is /search/results
Sidebar Item 1: isActive will be false.
Sidebar Item 2: isActive will be true because pathname?.startsWith(${href}/).
*/
