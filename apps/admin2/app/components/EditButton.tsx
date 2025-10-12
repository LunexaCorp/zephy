"use client";

import { Edit } from "lucide-react";
import Link from "next/link";

interface DeleteButtonProps {
  locationId: string;
}

export default function DeleteButton({ locationId }: DeleteButtonProps) {

  return (
    <Link
      href={`/locations/${locationId}/edit`}
      className="text-indigo-400 hover:text-indigo-300"
    >
      <Edit size={18} />
    </Link>
  );
}
