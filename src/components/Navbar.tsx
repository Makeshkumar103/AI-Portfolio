"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "ABOUT", href: "#about" },
    { name: "AI / LLM", href: "#ai" },
    { name: "EXPERIENCE", href: "#experience" },
    { name: "SKILLS", href: "#skills" },
    { name: "PROJECTS", href: "#projects" },
    { name: "EDUCATION", href: "#education" },
    { name: "CERTIFICATE", href: "#certificate" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 -mx-6 px-6 sm:-mx-12 sm:px-12 transition-all duration-300 ${scrolled ? "bg-white/70 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-5"
        }`}
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight">
          <span className="gradient-text">Makeshkumar</span>
          <span className="text-[#1e2235]">Portfolio</span>
          <span className="text-teal-600">.</span>
        </Link>
        <ul className="hidden lg:flex md:flex-row md:space-x-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="group relative block px-3 py-2 no-underline outline-none lg:px-4">
                <span className="text-xs lg:text-sm font-medium text-gray-600 transition-colors duration-300 group-hover:text-[#1e2235]">
                  {link.name}
                </span>
                <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-300 group-hover:w-2/3"></span>
              </Link>
            </li>
          ))}
        </ul>
        <button className="lg:hidden text-2xl text-[#1e2235] p-1" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-md rounded-b-xl border-t border-gray-100 overflow-hidden">
          <ul className="flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-violet-600"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.nav>
  );
}
