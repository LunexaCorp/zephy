import Link from "next/link";
import { SidebarItemProps } from "@/app/types/sidebar";

export default function SidebarItem({ icon, text, route, active, expanded = true }: SidebarItemProps) {
  return (
    <Link
      href={route}
      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors
        ${active ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"}
      `}
    >
      {icon}
      {expanded && <span className="text-sm font-medium">{text}</span>}
    </Link>
  );
}
