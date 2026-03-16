"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="bg-[#f5f5f5] py-24 md:py-32">
      <div ref={ref} className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400 mb-6">
            Become a Member
          </p>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            Join the
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-neutral-600 to-neutral-400">
              Movement
            </span>
          </h2>
          <p className="text-neutral-500 text-lg mt-8 max-w-lg mx-auto leading-relaxed">
            Get exclusive access to new drops, member-only content, and
            early invites to events. The future belongs to those who
            show up first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="#"
              className="bg-black text-white font-semibold text-sm px-10 py-4 rounded-full hover:bg-neutral-800 transition-all duration-300 hover:scale-105"
            >
              Join for Free
            </Link>
            <Link
              href="#"
              className="border-2 border-black text-black font-semibold text-sm px-10 py-4 rounded-full hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
