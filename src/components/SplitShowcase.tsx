"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function SplitShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="collections" className="bg-[#f5f5f5]">
      <div ref={ref} className="max-w-[1920px] mx-auto">
        {/* Full-width banner */}
        <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1 }}
            className="text-center px-6"
          >
            <p className="text-white/40 text-xs font-bold tracking-[0.4em] uppercase mb-4">
              Spring 2026
            </p>
            <h2 className="text-white text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter">
              MOVE BOLD
            </h2>
            <p className="text-white/50 text-lg mt-4 max-w-lg mx-auto">
              A collection built for momentum. Every piece designed to
              keep you moving forward.
            </p>
            <Link
              href="#"
              className="inline-block mt-8 bg-white text-black font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-neutral-200 transition-all duration-300 hover:scale-105"
            >
              Shop the Collection
            </Link>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-gradient-to-t from-white/5 to-transparent" />
        </div>

        {/* Split cards */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <SplitCard
            title="Performance"
            subtitle="Engineered"
            description="Tech-forward materials that adapt to your environment."
            bgColor="bg-[#1a1a1a]"
            textColor="text-white"
            delay={0.2}
            isInView={isInView}
          />
          <SplitCard
            title="Lifestyle"
            subtitle="Elevated"
            description="From street to studio. Versatile pieces for every moment."
            bgColor="bg-white"
            textColor="text-black"
            delay={0.4}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  );
}

function SplitCard({
  title,
  subtitle,
  description,
  bgColor,
  textColor,
  delay,
  isInView,
}: {
  title: string;
  subtitle: string;
  description: string;
  bgColor: string;
  textColor: string;
  delay: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className={`${bgColor} ${textColor} p-12 md:p-20 flex flex-col justify-between min-h-[500px]`}
    >
      <div>
        <p className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 mb-2">
          {subtitle}
        </p>
        <h3 className="text-4xl md:text-6xl font-black tracking-tight">
          {title}
        </h3>
      </div>
      <div>
        <p className="text-base opacity-60 max-w-sm">{description}</p>
        <Link
          href="#"
          className={`inline-block mt-6 font-semibold text-sm border-b-2 ${
            textColor === "text-white"
              ? "border-white hover:opacity-70"
              : "border-black hover:opacity-70"
          } transition-opacity pb-0.5`}
        >
          Shop Now
        </Link>
      </div>
    </motion.div>
  );
}
