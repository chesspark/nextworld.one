"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  geoOrthographic,
  geoPath,
  geoGraticule,
  geoCircle,
  type GeoPermissibleObjects,
} from "d3-geo";
import { feature } from "topojson-client";
import { countries } from "@/data/countries";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (feat.id && numericToIso[feat.id as any]) return numericToIso[feat.id as any];
  const name = feat.properties?.name || "";
  return nameToIso[name.toLowerCase()] || null;
}

function getSunPosition(): [number, number] {
  const now = new Date();
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
  const sunLng = -(utcHours / 24) * 360 + 180;
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const sunLat = 23.44 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
  return [sunLng, sunLat];
}

const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function Globe() {
  const router = useRouter();
  const [feats, setFeats] = useState<GeoFeature[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [rotation, setRotation] = useState<[number, number]>([-10, -25]);
  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState<[number, number] | null>(null);
  const [size, setSize] = useState({ w: 800, h: 800 });
  const [loaded, setLoaded] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; code: string } | null>(null);
  const [sunPos, setSunPos] = useState<[number, number]>(getSunPosition());
  const animRef = useRef<number>(0);

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
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Update sun position every 60s
  useEffect(() => {
    const id = setInterval(() => setSunPos(getSunPosition()), 60000);
    return () => clearInterval(id);
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (dragging || !loaded) return;
    const tick = () => {
      setRotation(([lon, lat]) => [lon - 0.08, lat]);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [dragging, loaded]);

  const radius = Math.min(size.w, size.h) * 0.4;

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
  const graticule = useMemo(() => geoGraticule().step([15, 15])(), []);

  const nightCircle = useMemo(() => {
    const circle = geoCircle()
      .center([sunPos[0] + 180, -sunPos[1]])
      .radius(90)();
    return pathGen(circle);
  }, [sunPos, pathGen]);

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
      <div className="h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/30 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden select-none" style={{ background: "radial-gradient(ellipse at 50% 45%, #0d1f3c 0%, #060e1a 50%, #020408 100%)" }}>
      {/* Subtle stars */}
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.15), transparent), radial-gradient(1px 1px at 80% 60%, rgba(255,255,255,0.25), transparent), radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.1), transparent), radial-gradient(1px 1px at 60% 50%, rgba(255,255,255,0.2), transparent)" }} />

      <svg
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
        <defs>
          {/* Ocean gradient */}
          <radialGradient id="ocean" cx="45%" cy="40%">
            <stop offset="0%" stopColor="#1a3a5c" />
            <stop offset="50%" stopColor="#0f2744" />
            <stop offset="100%" stopColor="#091b33" />
          </radialGradient>
          {/* Atmosphere glow */}
          <radialGradient id="atmo" cx="50%" cy="50%">
            <stop offset="85%" stopColor="transparent" />
            <stop offset="93%" stopColor="rgba(80,160,255,0.08)" />
            <stop offset="100%" stopColor="rgba(60,130,220,0.03)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Atmosphere ring */}
        <circle
          cx={size.w / 2}
          cy={size.h / 2}
          r={radius + 15}
          fill="url(#atmo)"
        />

        {/* Ocean */}
        <circle
          cx={size.w / 2}
          cy={size.h / 2}
          r={radius}
          fill="url(#ocean)"
          stroke="rgba(100,180,255,0.1)"
          strokeWidth={0.5}
        />

        {/* Graticule */}
        <path
          d={pathGen(graticule) || ""}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={0.4}
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
                  ? "#4a9e6e"
                  : isActive
                    ? "#2d6b47"
                    : "#1e4a35"
              }
              stroke={
                isHovered
                  ? "rgba(255,255,255,0.6)"
                  : isActive
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(255,255,255,0.08)"
              }
              strokeWidth={isHovered ? 1.2 : 0.3}
              style={{
                cursor: isActive ? "pointer" : "grab",
                transition: "fill 0.15s, stroke 0.15s",
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

        {/* Day/Night shadow overlay */}
        {nightCircle && (
          <path
            d={nightCircle}
            fill="rgba(0,0,10,0.35)"
            stroke="none"
            style={{ pointerEvents: "none" }}
          />
        )}

        {/* Rim light */}
        <circle
          cx={size.w / 2}
          cy={size.h / 2}
          r={radius}
          fill="none"
          stroke="rgba(100,180,255,0.12)"
          strokeWidth={1.5}
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
            <div className="bg-black/80 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/10 shadow-xl">
              <div className="text-[10px] text-white/40 tracking-[0.1em] uppercase">{country.code}</div>
              <div className="text-sm font-bold">{country.name}</div>
              <div className="text-[11px] text-white/40 mt-0.5">{country.landmark}</div>
            </div>
          </div>
        );
      })()}

      {/* Subtle title overlay */}
      <div className="absolute bottom-8 left-0 right-0 pointer-events-none text-center">
        <p className="text-white/15 text-[10px] font-medium tracking-[0.5em] uppercase mb-1">
          200 Countries &middot; 1000 Leaders &middot; 10 Days
        </p>
        <h1 className="text-white/20 text-lg sm:text-xl font-black tracking-tight">
          NEXT<span className="text-white/10">WORLD</span>
        </h1>
      </div>

      {/* Click hint */}
      <div className="absolute bottom-8 right-8 pointer-events-none">
        <p className="text-white/10 text-[10px] tracking-wider">
          Drag to rotate &middot; Click a country
        </p>
      </div>
    </div>
  );
}
