"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { countries } from "@/data/countries";

/* eslint-disable @typescript-eslint/no-explicit-any */
const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false }) as any;

const GEOJSON_URLS = [
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  "https://unpkg.com/world-atlas@2/countries-50m.json",
];

interface GeoFeature {
  type: string;
  properties: {
    name?: string;
    ADMIN?: string;
    ISO_A2?: string;
    iso_a2?: string;
  };
  geometry: object;
}

interface TopoJSON {
  type: string;
  objects?: {
    countries?: {
      geometries: any[];
    };
  };
  arcs?: any[];
}

const countryCodeSet = new Set(countries.map((c) => c.code));

const nameToIso: Record<string, string> = {};
countries.forEach((c) => {
  nameToIso[c.name.toLowerCase()] = c.code;
});
nameToIso["united states of america"] = "US";
nameToIso["united kingdom"] = "GB";
nameToIso["korea, republic of"] = "KR";
nameToIso["russian federation"] = "RU";
nameToIso["czech republic"] = "CZ";
nameToIso["viet nam"] = "VN";
nameToIso["iran, islamic republic of"] = "IR";
nameToIso["republic of korea"] = "KR";
nameToIso["s. korea"] = "KR";
nameToIso["dem. rep. korea"] = "KP";
nameToIso["saudi arabia"] = "SA";
nameToIso["south africa"] = "ZA";
nameToIso["new zealand"] = "NZ";
nameToIso["united arab emirates"] = "AE";
nameToIso["u.a.e."] = "AE";

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

function getIsoFromFeature(feat: any): string | null {
  const props = feat.properties || {};
  const iso = props.ISO_A2 || props.iso_a2;
  if (iso && iso !== "-99") return iso;

  if (feat.id && numericToIso[feat.id]) return numericToIso[feat.id];

  const name = props.name || props.ADMIN || "";
  return nameToIso[name.toLowerCase()] || null;
}

export default function Globe() {
  const router = useRouter();
  const globeRef = useRef<any>(null);
  const [geoFeatures, setGeoFeatures] = useState<GeoFeature[] | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadGeo() {
      for (const url of GEOJSON_URLS) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();

          if (cancelled) return;

          if (data.type === "Topology" && data.objects) {
            const topojson = await import("topojson-client");
            const key = Object.keys(data.objects)[0];
            const fc = topojson.feature(data, data.objects[key]);
            if ("features" in fc) {
              setGeoFeatures(fc.features as GeoFeature[]);
            }
            return;
          }

          if (data.features) {
            setGeoFeatures(data.features);
            return;
          }
        } catch {
          continue;
        }
      }
      if (!cancelled) setLoadError(true);
    }

    loadGeo();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const update = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (globeRef.current && geoFeatures) {
      const globe = globeRef.current;
      try {
        const controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
      } catch { /* controls not ready yet */ }
      globe.pointOfView({ lat: 20, lng: 10, altitude: 2.2 });
    }
  }, [geoFeatures]);

  const handleClick = useCallback(
    (feat: object) => {
      const feature = feat as GeoFeature;
      const iso = getIsoFromFeature(feature);
      if (iso && countryCodeSet.has(iso)) {
        router.push(`/country/${iso}`);
      }
    },
    [router]
  );

  const getColor = useCallback(
    (feat: object) => {
      const feature = feat as GeoFeature;
      const iso = getIsoFromFeature(feature);
      if (iso === hovered) return "rgba(255,255,255,0.35)";
      if (iso && countryCodeSet.has(iso)) return "rgba(255,255,255,0.15)";
      return "rgba(255,255,255,0.04)";
    },
    [hovered]
  );

  const getSideColor = useCallback(
    (feat: object) => {
      const feature = feat as GeoFeature;
      const iso = getIsoFromFeature(feature);
      if (iso === hovered) return "rgba(255,255,255,0.2)";
      return "rgba(255,255,255,0.05)";
    },
    [hovered]
  );

  const getStrokeColor = useCallback(
    (feat: object) => {
      const feature = feat as GeoFeature;
      const iso = getIsoFromFeature(feature);
      if (iso === hovered) return "#ffffff";
      if (iso && countryCodeSet.has(iso)) return "rgba(255,255,255,0.5)";
      return "rgba(255,255,255,0.15)";
    },
    [hovered]
  );

  const handleHover = useCallback((feat: object | null) => {
    const feature = feat as GeoFeature | null;
    if (!feature) {
      setHovered(null);
      document.body.style.cursor = "default";
      return;
    }
    const iso = getIsoFromFeature(feature);
    setHovered(iso && countryCodeSet.has(iso) ? iso : null);
    document.body.style.cursor =
      iso && countryCodeSet.has(iso) ? "pointer" : "default";
  }, []);

  const getLabel = useCallback((feat: object) => {
    const feature = feat as GeoFeature;
    const iso = getIsoFromFeature(feature);
    if (!iso) return "";
    const country = countries.find((c) => c.code === iso);
    if (!country) return "";
    return `<div style="background:rgba(0,0,0,0.85);color:#fff;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1)">
      <div style="font-size:10px;opacity:0.6;margin-bottom:2px;letter-spacing:0.1em">${country.code}</div>
      ${country.name}
      <div style="font-size:11px;opacity:0.5;margin-top:2px">${country.landmark}</div>
    </div>`;
  }, []);

  if (loadError) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-sm">Failed to load globe data.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-white text-sm underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!geoFeatures) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm tracking-widest uppercase">
            Loading Globe
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <GlobeGL
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl=""
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#ffffff"
        atmosphereAltitude={0.15}
        polygonsData={geoFeatures}
        polygonAltitude={(d: object) => {
          const f = d as GeoFeature;
          const iso = getIsoFromFeature(f);
          return iso === hovered ? 0.04 : 0.01;
        }}
        polygonCapColor={getColor}
        polygonSideColor={getSideColor}
        polygonStrokeColor={getStrokeColor}
        polygonLabel={getLabel}
        onPolygonClick={handleClick}
        onPolygonHover={handleHover}
      />

      {/* Overlay info */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none pt-24 px-6 md:px-12 text-center">
        <p className="text-white/40 text-xs font-bold tracking-[0.4em] uppercase mb-3">
          200 Countries &middot; 1000 Leaders &middot; 10 Days
        </p>
        <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter">
          NEXT
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-400 to-neutral-600">
            WORLD
          </span>
        </h1>
        <p className="text-white/40 text-sm md:text-base mt-3 max-w-md mx-auto">
          Click on any country to discover its delegates
        </p>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
