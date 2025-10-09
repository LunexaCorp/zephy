import Link from 'next/link';
import { Plus } from 'lucide-react';
import { HTMLAttributes } from 'react';

interface AddButtonProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  text: string;
}

export default function AddButton({ href, text }: AddButtonProps) {
  return (
    <Link
      href={href}
      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      <Plus size={20} className="mr-2" />
      {text}
    </Link>
  );
}
