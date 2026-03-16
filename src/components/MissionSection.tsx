"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function MissionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="mission" className="bg-black py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-white/10 blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-white/30 text-xs font-bold tracking-[0.4em] uppercase mb-6">
            Our Mission
          </p>
          <h2 className="text-white text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Uniting <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">1,000 minds</span> from{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">200 countries</span>
          </h2>
          <p className="text-white/40 text-lg mt-8 max-w-2xl mx-auto leading-relaxed">
            NEXTWORLD is a global think-tank summit bringing together five
            exceptional leaders from each country — thinkers, creators,
            scientists, and entrepreneurs — for 10 transformative days of
            collaboration on humanity&apos;s most pressing challenges.
          </p>

          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            {[
              { value: "200", label: "Countries" },
              { value: "1,000", label: "Delegates" },
              { value: "10", label: "Days" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <div className="text-white text-3xl md:text-4xl font-black">
                  {stat.value}
                </div>
                <div className="text-white/30 text-xs mt-1 font-medium tracking-wider uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
