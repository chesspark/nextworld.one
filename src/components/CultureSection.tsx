"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const articles = [
  {
    category: "Design",
    title: "The Art of Minimalism in Modern Product Design",
    reading: "5 min read",
  },
  {
    category: "Technology",
    title: "How AI Is Shaping the Future of Fashion",
    reading: "8 min read",
  },
  {
    category: "Culture",
    title: "Street Culture Meets High Design: A New Era",
    reading: "6 min read",
  },
  {
    category: "Innovation",
    title: "Sustainable Materials That Don't Compromise Style",
    reading: "4 min read",
  },
];

export default function CultureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="culture" className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400 mb-3">
              Journal
            </p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Culture
            </h2>
          </div>
          <Link
            href="#"
            className="hidden md:flex items-center gap-1 text-sm font-semibold hover:underline"
          >
            View All <ArrowUpRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
            >
              <Link href="#" className="group block">
                <div className="relative aspect-[16/9] bg-[#f5f5f5] rounded-xl overflow-hidden">
                  {/* Abstract background pattern */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${
                        i % 2 === 0 ? "bg-black" : "bg-neutral-600"
                      } ${i % 3 === 0 ? "scale-150" : ""}`}
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold tracking-tight group-hover:underline line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2">
                    {article.reading}
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
