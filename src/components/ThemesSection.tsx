"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { themes } from "@/data/themes";

export default function ThemesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="themes" className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400 mb-3">
            The Program
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            10 Days. 10 Themes.
          </h2>
          <p className="text-neutral-500 mt-4 max-w-xl mx-auto">
            Each day focuses on a critical global challenge, bringing together
            five leaders per country to forge actionable solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.day}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-[1px]"
            >
              <div className="relative bg-white rounded-2xl p-6 h-full flex flex-col hover:bg-neutral-50 transition-colors">
                <div className="text-3xl mb-3">{theme.icon}</div>
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-300 mb-1">
                  Day {theme.day}
                </div>
                <h3 className="text-sm font-bold tracking-tight mb-2">
                  {theme.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mt-auto">
                  {theme.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
