"use client";

import { useState } from "react";
import { Home, Settings, MapPinned } from "lucide-react";
import SidebarItem from "../components/SideBarItem";
import { SidebarItemProps } from "@/app/types/sidebar";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  const items: SidebarItemProps[] = [
    {
      icon: <Home size={20} />,
      text: "Inicio",
      route: "/",
      active: true,
      expanded,
    },
    {
      icon: <MapPinned size={20} />,
      text: "Ubicaciones",
      route: "/locations",
      active: false,
      expanded,
    },

    {
      icon: <Settings size={20} />,
      text: "Configuración",
      route: "/settings",
      active: false,
      expanded,
    },
  ];

  return (
    <div
      className={`h-screen ${
        expanded ? "w-64" : "w-20"
      } bg-gray-900 text-white flex flex-col transition-all`}
    >
      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="p-4 focus:outline-none hover:bg-gray-800"
      >
        {expanded ? "<<" : ">>"}
      </button>

      {/* Render dinámico */}
      <nav className="flex flex-col gap-2 mt-4">
        {items.map((item, idx) => (
          <SidebarItem
            key={idx}
            {...item}
            expanded={expanded}
            active={pathname === item.route}
          />
        ))}
      </nav>
    </div>
  );
}
