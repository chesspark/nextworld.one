"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Globe", href: "/" },
  { label: "Program", href: "/#themes" },
  { label: "Mission", href: "/#mission" },
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 shrink-0">
          <span className="text-lg font-black tracking-tighter text-white">
            NEXT
          </span>
          <span className="text-lg font-black tracking-tighter text-white/50">
            WORLD
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-medium tracking-wider text-white/40 hover:text-white transition-colors uppercase"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/25"
          >
            <LogIn size={13} />
            <span className="hidden sm:inline">Connexion</span>
          </Link>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-full text-white/40 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Menu size={20} strokeWidth={1.5} />
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
            className="md:hidden overflow-hidden bg-black/90 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-semibold text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-lg font-semibold text-white/70 hover:text-white transition-colors"
              >
                Connexion
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
