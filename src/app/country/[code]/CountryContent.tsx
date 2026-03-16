"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { Country } from "@/data/countries";

interface Person {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  countryCode: string;
}

export default function CountryContent({
  country,
  initialPeople,
}: {
  country: Country;
  initialPeople: Person[];
}) {
  const slots = Array.from({ length: 5 }, (_, i) => initialPeople[i] || null);

  return (
    <section className="relative -mt-8 px-6 md:px-12 pb-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-white text-2xl font-bold tracking-tight">
            Delegates
          </h2>
          <p className="text-white/30 text-sm mt-1">
            5 leaders representing {country.name} at NEXTWORLD
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {slots.map((person, i) => (
            <motion.div
              key={person?.id || `empty-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {person ? (
                <PersonCard person={person} index={i} />
              ) : (
                <EmptySlot index={i} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonCard({ person, index }: { person: Person; index: number }) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
      {/* Avatar area */}
      <div className="aspect-[3/4] relative bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center overflow-hidden">
        {person.imageUrl ? (
          <img
            src={person.imageUrl}
            alt={person.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center">
            <User size={48} className="text-white/20" />
          </div>
        )}
        {/* Number badge */}
        <div className="absolute top-3 left-3 w-7 h-7 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">
          {index + 1}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-sm tracking-tight">
          {person.name}
        </h3>
        <p className="text-white/50 text-xs mt-1">{person.title}</p>
        {person.description && (
          <p className="text-white/30 text-xs mt-2 leading-relaxed line-clamp-2">
            {person.description}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptySlot({ index }: { index: number }) {
  return (
    <div className="relative bg-white/[0.02] border border-dashed border-white/10 rounded-2xl overflow-hidden">
      <div className="aspect-[3/4] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mx-auto mb-3">
            <User size={24} className="text-white/10" />
          </div>
          <p className="text-white/15 text-xs font-medium">
            Delegate #{index + 1}
          </p>
          <p className="text-white/10 text-[10px] mt-1">To be announced</p>
        </div>
      </div>
    </div>
  );
}
