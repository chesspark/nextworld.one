"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Globe", href: "/" },
  { label: "Program", href: "/#themes" },
  { label: "Mission", href: "/#mission" },
  { label: "Admin", href: "/admin" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[#f5f5f5] text-center text-xs py-2 px-4 font-medium tracking-wide">
        Free Shipping on Orders Over $150 |{" "}
        <span className="underline cursor-pointer">Join Us</span>
      </div>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm"
            : "bg-white"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="text-2xl font-black tracking-tighter">
              NEXT
            </span>
            <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-black to-neutral-500">
              WORLD
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium tracking-wide hover:text-neutral-500 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Cart"
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors relative"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile toggle */}
            <button
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X size={22} strokeWidth={1.5} />
              ) : (
                <Menu size={22} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white border-t border-neutral-100"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-semibold tracking-tight hover:text-neutral-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
