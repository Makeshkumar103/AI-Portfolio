import Link from "next/link";
import { Lock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 mt-20">
      <div className="max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          © {currentYear} Makeshkumar. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Built with <span className="text-pink-500">♥</span> using Next.js & Tailwind CSS
          </p>
          <Link
            href="/admin"
            className="text-xs text-gray-400 hover:text-violet-600 transition-colors flex items-center gap-1"
            title="Administrator Portal"
          >
            <Lock size={12} />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
