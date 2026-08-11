export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-gray-200 mt-20">
      <div className="max-w-[92rem] mx-auto px-6 sm:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          © {currentYear} Muthu. All rights reserved.
        </p>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          Built with <span className="text-pink-500">♥</span> using Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
