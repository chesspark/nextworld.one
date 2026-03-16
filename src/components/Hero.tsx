"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[100vh] min-h-[700px] bg-black overflow-hidden flex items-center justify-center">
      {/* Background video placeholder — gradient + animated shapes */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-800" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-white/5 to-transparent blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-l from-white/5 to-transparent blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/60 text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-6"
        >
          Introducing
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter leading-[0.85]"
        >
          NEXT
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-400 to-neutral-600">
            WORLD
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-white/50 text-lg md:text-xl mt-8 max-w-xl mx-auto leading-relaxed"
        >
          Redefining what&apos;s possible. Where technology meets culture
          and design meets purpose.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <Link
            href="#featured"
            className="bg-white text-black font-semibold text-sm px-10 py-4 rounded-full hover:bg-neutral-200 transition-all duration-300 hover:scale-105"
          >
            Explore Now
          </Link>
          <Link
            href="#collections"
            className="border border-white/30 text-white font-semibold text-sm px-10 py-4 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            View Collections
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
