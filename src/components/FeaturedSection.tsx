"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const featured = [
  {
    tag: "Just In",
    title: "The Apex Collection",
    description: "Engineered for the next generation. Precision meets style.",
    color: "from-orange-500/20 via-red-500/10 to-transparent",
    accent: "bg-orange-500",
  },
  {
    tag: "Trending",
    title: "Urban Pulse Series",
    description: "Street-ready design. Built for those who move different.",
    color: "from-blue-500/20 via-indigo-500/10 to-transparent",
    accent: "bg-blue-500",
  },
  {
    tag: "Exclusive",
    title: "Noir Essentials",
    description: "Minimalism elevated. The dark side of sophistication.",
    color: "from-neutral-500/20 via-neutral-700/10 to-transparent",
    accent: "bg-neutral-500",
  },
];

export default function FeaturedSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="featured" className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400 mb-3">
            Featured
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            What&apos;s New
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {featured.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
            >
              <Link href="#" className="group block">
                <div className="relative aspect-[4/5] bg-[#f5f5f5] rounded-2xl overflow-hidden">
                  {/* Gradient background acting as image placeholder */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color}`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8rem] md:text-[10rem] font-black text-black/5 select-none group-hover:scale-110 transition-transform duration-700">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Tag */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`${item.accent} text-white text-xs font-bold px-3 py-1.5 rounded-full`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-bold tracking-tight group-hover:underline">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    {item.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
