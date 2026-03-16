"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { geoOrthographic, geoPath, geoGraticule, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import { countries } from "@/data/countries";
import { motion } from "framer-motion";

interface GeoFeature {
  type: string;
  id?: string;
  properties: { name?: string };
  geometry: GeoPermissibleObjects;
}

const countryCodeSet = new Set(countries.map((c) => c.code));

const numericToIso: Record<string, string> = {
  "250": "FR", "840": "US", "826": "GB", "392": "JP", "076": "BR",
  "276": "DE", "380": "IT", "156": "CN", "356": "IN", "036": "AU",
  "643": "RU", "124": "CA", "484": "MX", "818": "EG", "710": "ZA",
  "410": "KR", "032": "AR", "724": "ES", "682": "SA", "792": "TR",
  "566": "NG", "404": "KE", "764": "TH", "752": "SE", "756": "CH",
  "376": "IL", "784": "AE", "702": "SG", "504": "MA", "170": "CO",
  "604": "PE", "300": "GR", "620": "PT", "616": "PL", "578": "NO",
  "554": "NZ", "152": "CL", "360": "ID", "608": "PH", "704": "VN",
};

const nameToIso: Record<string, string> = {};
countries.forEach((c) => { nameToIso[c.name.toLowerCase()] = c.code; });
nameToIso["united states of america"] = "US";
nameToIso["united kingdom"] = "GB";
nameToIso["russian federation"] = "RU";
nameToIso["south korea"] = "KR";
nameToIso["s. korea"] = "KR";
nameToIso["saudi arabia"] = "SA";
nameToIso["south africa"] = "ZA";
nameToIso["new zealand"] = "NZ";
nameToIso["united arab emirates"] = "AE";

function getIso(feat: GeoFeature): string | null {
  if (feat.id && numericToIso[feat.id]) return numericToIso[feat.id];
  const name = feat.properties?.name || "";
  return nameToIso[name.toLowerCase()] || null;
}

const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function Globe() {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [feats, setFeats] = useState<GeoFeature[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [rotation, setRotation] = useState<[number, number]>([-10, -25]);
  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState<[number, number] | null>(null);
  const [size, setSize] = useState({ w: 800, h: 800 });
  const [loaded, setLoaded] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; code: string } | null>(null);

  useEffect(() => {
    fetch(TOPO_URL)
      .then((r) => r.json())
      .then((topo) => {
        const key = Object.keys(topo.objects)[0];
        const fc = feature(topo, topo.objects[key]);
        if ("features" in fc) {
          setFeats(fc.features as unknown as GeoFeature[]);
          setLoaded(true);
        }
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const update = () => {
      const s = Math.min(window.innerWidth, window.innerHeight);
      setSize({ w: window.innerWidth, h: window.innerHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Auto-rotate when not dragging
  useEffect(() => {
    if (dragging || !loaded) return;
    const id = setInterval(() => {
      setRotation(([lon, lat]) => [lon - 0.15, lat]);
    }, 30);
    return () => clearInterval(id);
  }, [dragging, loaded]);

  const radius = Math.min(size.w, size.h) * 0.42;

  const projection = useMemo(
    () =>
      geoOrthographic()
        .rotate([rotation[0], rotation[1], 0])
        .translate([size.w / 2, size.h / 2])
        .scale(radius)
        .clipAngle(90),
    [rotation, size.w, size.h, radius]
  );

  const pathGen = useMemo(() => geoPath(projection), [projection]);
  const graticule = useMemo(() => geoGraticule()(), []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    setLastMouse([e.clientX, e.clientY]);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !lastMouse) return;
      const dx = e.clientX - lastMouse[0];
      const dy = e.clientY - lastMouse[1];
      setRotation(([lon, lat]) => [
        lon - dx * 0.3,
        Math.max(-60, Math.min(60, lat + dy * 0.3)),
      ]);
      setLastMouse([e.clientX, e.clientY]);
    },
    [dragging, lastMouse]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    setLastMouse(null);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    setDragging(true);
    setLastMouse([t.clientX, t.clientY]);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragging || !lastMouse) return;
      const t = e.touches[0];
      const dx = t.clientX - lastMouse[0];
      const dy = t.clientY - lastMouse[1];
      setRotation(([lon, lat]) => [
        lon - dx * 0.3,
        Math.max(-60, Math.min(60, lat + dy * 0.3)),
      ]);
      setLastMouse([t.clientX, t.clientY]);
    },
    [dragging, lastMouse]
  );

  const handleTouchEnd = useCallback(() => {
    setDragging(false);
    setLastMouse(null);
  }, []);

  const handleCountryClick = useCallback(
    (feat: GeoFeature) => {
      const iso = getIso(feat);
      if (iso && countryCodeSet.has(iso)) {
        router.push(`/country/${iso}`);
      }
    },
    [router]
  );

  if (!loaded) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm tracking-widest uppercase">Loading Globe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden select-none">
      <svg
        ref={svgRef}
        width={size.w}
        height={size.h}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        {/* Globe sphere */}
        <defs>
          <radialGradient id="globe-gradient" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
          <radialGradient id="globe-glow" cx="50%" cy="50%">
            <stop offset="80%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
          </radialGradient>
        </defs>

        {/* Globe background */}
        <circle
          cx={size.w / 2}
          cy={size.h / 2}
          r={radius}
          fill="url(#globe-gradient)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />

        {/* Graticule */}
        <path
          d={pathGen(graticule) || ""}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={0.5}
        />

        {/* Countries */}
        {feats.map((feat, i) => {
          const iso = getIso(feat);
          const isActive = iso && countryCodeSet.has(iso);
          const isHovered = iso === hovered;
          const d = pathGen(feat as unknown as GeoPermissibleObjects);
          if (!d) return null;

          return (
            <path
              key={i}
              d={d}
              fill={
                isHovered
                  ? "rgba(255,255,255,0.4)"
                  : isActive
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.05)"
              }
              stroke={
                isHovered
                  ? "#fff"
                  : isActive
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(255,255,255,0.1)"
              }
              strokeWidth={isHovered ? 1.5 : 0.5}
              style={{
                cursor: isActive ? "pointer" : "grab",
                transition: "fill 0.2s, stroke 0.2s",
              }}
              onMouseEnter={(e) => {
                if (isActive && iso) {
                  setHovered(iso);
                  setTooltip({ x: e.clientX, y: e.clientY, code: iso });
                }
              }}
              onMouseMove={(e) => {
                if (tooltip) {
                  setTooltip({ ...tooltip, x: e.clientX, y: e.clientY });
                }
              }}
              onMouseLeave={() => {
                setHovered(null);
                setTooltip(null);
              }}
              onClick={(e) => {
                if (isActive) {
                  e.stopPropagation();
                  handleCountryClick(feat);
                }
              }}
            />
          );
        })}

        {/* Outer glow */}
        <circle
          cx={size.w / 2}
          cy={size.h / 2}
          r={radius + 2}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={4}
        />
      </svg>

      {/* Tooltip */}
      {tooltip && (() => {
        const country = countries.find((c) => c.code === tooltip.code);
        if (!country) return null;
        return (
          <div
            className="fixed z-50 pointer-events-none"
            style={{ left: tooltip.x + 16, top: tooltip.y - 10 }}
          >
            <div className="bg-black/90 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/10 shadow-2xl">
              <div className="text-[10px] text-white/40 tracking-[0.15em] uppercase mb-0.5">
                {country.code}
              </div>
              <div className="text-sm font-bold">{country.name}</div>
              <div className="text-xs text-white/50 mt-0.5">{country.landmark}</div>
            </div>
          </div>
        );
      })()}

      {/* Overlay text */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none pt-24 px-6 md:px-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/40 text-xs font-bold tracking-[0.4em] uppercase mb-3"
        >
          200 Countries &middot; 1000 Leaders &middot; 10 Days
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter"
        >
          NEXT
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-400 to-neutral-600">
            WORLD
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/40 text-sm md:text-base mt-3 max-w-md mx-auto"
        >
          Click on any country to discover its delegates
        </motion.p>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
