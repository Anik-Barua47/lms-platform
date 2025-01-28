"use client";

import { Compass, Layout } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

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

export const SidebarRoutes = () => {
  const routes = guestRoutes;

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
