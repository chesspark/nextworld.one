"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "150+", label: "Countries" },
  { value: "2M+", label: "Community Members" },
  { value: "500+", label: "Products" },
  { value: "99%", label: "Satisfaction" },
];

export default function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="bg-black py-16 md:py-20">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-white text-4xl md:text-5xl font-black tracking-tight">
              {stat.value}
            </div>
            <div className="text-neutral-500 text-sm mt-2 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
