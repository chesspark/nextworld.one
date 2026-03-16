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
  // Europe
  "250": "FR", "826": "GB", "276": "DE", "380": "IT", "724": "ES",
  "620": "PT", "528": "NL", "056": "BE", "040": "AT", "756": "CH",
  "752": "SE", "578": "NO", "208": "DK", "246": "FI", "352": "IS",
  "372": "IE", "616": "PL", "203": "CZ", "703": "SK", "348": "HU",
  "642": "RO", "100": "BG", "191": "HR", "705": "SI", "688": "RS",
  "070": "BA", "499": "ME", "807": "MK", "008": "AL", "300": "GR",
  "196": "CY", "470": "MT", "442": "LU", "233": "EE", "428": "LV",
  "440": "LT", "804": "UA", "498": "MD", "112": "BY", "268": "GE",
  "051": "AM", "031": "AZ",
  // North America
  "840": "US", "124": "CA", "484": "MX", "320": "GT", "084": "BZ",
  "340": "HN", "222": "SV", "558": "NI", "188": "CR", "591": "PA",
  "192": "CU", "388": "JM", "332": "HT", "214": "DO", "780": "TT",
  // South America
  "076": "BR", "032": "AR", "170": "CO", "604": "PE", "152": "CL",
  "862": "VE", "218": "EC", "068": "BO", "600": "PY", "858": "UY",
  "328": "GY", "740": "SR",
  // Asia
  "156": "CN", "392": "JP", "356": "IN", "410": "KR", "360": "ID",
  "764": "TH", "704": "VN", "608": "PH", "458": "MY", "702": "SG",
  "104": "MM", "116": "KH", "418": "LA", "050": "BD", "144": "LK",
  "524": "NP", "586": "PK", "004": "AF", "860": "UZ", "398": "KZ",
  "795": "TM", "417": "KG", "762": "TJ", "496": "MN", "408": "KP",
  "158": "TW", "096": "BN", "626": "TL", "064": "BT", "462": "MV",
  // Middle East
  "792": "TR", "682": "SA", "784": "AE", "376": "IL", "364": "IR",
  "368": "IQ", "400": "JO", "422": "LB", "760": "SY", "887": "YE",
  "512": "OM", "634": "QA", "048": "BH", "414": "KW", "275": "PS",
  // Africa
  "818": "EG", "710": "ZA", "566": "NG", "404": "KE", "504": "MA",
  "231": "ET", "834": "TZ", "288": "GH", "686": "SN", "384": "CI",
  "120": "CM", "800": "UG", "646": "RW", "508": "MZ", "450": "MG",
  "024": "AO", "180": "CD", "178": "CG", "788": "TN", "012": "DZ",
  "434": "LY", "736": "SD", "728": "SS", "466": "ML", "854": "BF",
  "562": "NE", "148": "TD", "478": "MR", "270": "GM", "624": "GW",
  "324": "GN", "694": "SL", "430": "LR", "768": "TG", "204": "BJ",
  "266": "GA", "226": "GQ", "140": "CF", "108": "BI", "232": "ER",
  "262": "DJ", "706": "SO", "894": "ZM", "716": "ZW", "072": "BW",
  "516": "NA", "748": "SZ", "426": "LS", "454": "MW", "480": "MU",
  "690": "SC", "132": "CV", "678": "ST", "174": "KM",
  // Oceania
  "036": "AU", "554": "NZ", "598": "PG", "242": "FJ", "882": "WS",
  "776": "TO", "548": "VU", "090": "SB",
  // Russia
  "643": "RU",
};

const nameToIso: Record<string, string> = {};
countries.forEach((c) => { nameToIso[c.name.toLowerCase()] = c.code; });
nameToIso["united states of america"] = "US";
nameToIso["united kingdom"] = "GB";
nameToIso["russian federation"] = "RU";
nameToIso["south korea"] = "KR";
nameToIso["s. korea"] = "KR";
nameToIso["rep. of korea"] = "KR";
nameToIso["korea"] = "KR";
nameToIso["dem. rep. korea"] = "KP";
nameToIso["saudi arabia"] = "SA";
nameToIso["south africa"] = "ZA";
nameToIso["new zealand"] = "NZ";
nameToIso["united arab emirates"] = "AE";
nameToIso["czech rep."] = "CZ";
nameToIso["czechia"] = "CZ";
nameToIso["bosnia and herz."] = "BA";
nameToIso["n. macedonia"] = "MK";
nameToIso["central african rep."] = "CF";
nameToIso["dem. rep. congo"] = "CD";
nameToIso["congo"] = "CG";
nameToIso["eq. guinea"] = "GQ";
nameToIso["w. sahara"] = "EH";
nameToIso["s. sudan"] = "SS";
nameToIso["côte d'ivoire"] = "CI";
nameToIso["ivory coast"] = "CI";
nameToIso["timor-leste"] = "TL";
nameToIso["e. timor"] = "TL";
nameToIso["papua new guinea"] = "PG";
nameToIso["solomon is."] = "SB";
nameToIso["dominican rep."] = "DO";
nameToIso["trinidad and tobago"] = "TT";
nameToIso["são tomé and príncipe"] = "ST";
nameToIso["guinea-bissau"] = "GW";
nameToIso["eswatini"] = "SZ";
nameToIso["swaziland"] = "SZ";
nameToIso["burma"] = "MM";
nameToIso["lao pdr"] = "LA";

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
    <div className="relative h-screen overflow-hidden select-none" style={{ background: "#020810" }}>
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
                  ? "#3b82c8"
                  : isActive
                    ? "#1e4f80"
                    : "#15334f"
              }
              stroke={
                isHovered
                  ? "rgba(140,200,255,0.7)"
                  : isActive
                    ? "rgba(100,170,255,0.25)"
                    : "rgba(80,140,220,0.1)"
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
