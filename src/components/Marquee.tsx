export default function Marquee() {
  const words = [
    "INNOVATION",
    "DESIGN",
    "CULTURE",
    "TECHNOLOGY",
    "FUTURE",
    "MOVEMENT",
    "CRAFT",
    "VISION",
  ];

  return (
    <div className="bg-black py-4 overflow-hidden border-y border-neutral-800">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...words, ...words].map((word, i) => (
          <span
            key={i}
            className="text-white/20 text-sm font-bold tracking-[0.3em] mx-8"
          >
            {word} &mdash;
          </span>
        ))}
      </div>
    </div>
  );
}
