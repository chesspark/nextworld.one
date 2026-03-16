"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { countries } from "@/data/countries";

/* eslint-disable @typescript-eslint/no-explicit-any */
const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false }) as any;

const GEOJSON_URL =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

interface GeoFeature {
  type: string;
  properties: {
    ADMIN: string;
    ISO_A2: string;
    ISO_A3?: string;
  };
  geometry: object;
}

interface GeoJSON {
  type: string;
  features: GeoFeature[];
}

const countryCodeSet = new Set(countries.map((c) => c.code));

export default function Globe() {
  const router = useRouter();
  const globeRef = useRef<any>(null);
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((data: GeoJSON) => setGeoData(data));
  }, []);

  useEffect(() => {
    const update = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const globe = globeRef.current as {
        controls: () => { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean };
        pointOfView: (pov: { lat: number; lng: number; altitude: number }) => void;
      };
      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = true;
      globe.pointOfView({ lat: 20, lng: 10, altitude: 2.2 });
    }
  }, [geoData]);

  const handleClick = useCallback(
    (feat: object) => {
      const feature = feat as GeoFeature;
      const iso = feature.properties?.ISO_A2;
      if (iso && countryCodeSet.has(iso)) {
        router.push(`/country/${iso}`);
      }
    },
    [router]
  );

  const getColor = useCallback(
    (feat: object) => {
      const feature = feat as GeoFeature;
      const iso = feature.properties?.ISO_A2;
      if (iso === hovered) return "rgba(255,255,255,0.35)";
      if (iso && countryCodeSet.has(iso)) return "rgba(255,255,255,0.15)";
      return "rgba(255,255,255,0.04)";
    },
    [hovered]
  );

  const getSideColor = useCallback(
    (feat: object) => {
      const feature = feat as GeoFeature;
      const iso = feature.properties?.ISO_A2;
      if (iso === hovered) return "rgba(255,255,255,0.2)";
      return "rgba(255,255,255,0.05)";
    },
    [hovered]
  );

  const getStrokeColor = useCallback(
    (feat: object) => {
      const feature = feat as GeoFeature;
      const iso = feature.properties?.ISO_A2;
      if (iso === hovered) return "#ffffff";
      if (iso && countryCodeSet.has(iso)) return "rgba(255,255,255,0.5)";
      return "rgba(255,255,255,0.15)";
    },
    [hovered]
  );

  const handleHover = useCallback((feat: object | null) => {
    const feature = feat as GeoFeature | null;
    const iso = feature?.properties?.ISO_A2 ?? null;
    setHovered(iso && countryCodeSet.has(iso) ? iso : null);
    document.body.style.cursor =
      iso && countryCodeSet.has(iso) ? "pointer" : "default";
  }, []);

  const getLabel = useCallback((feat: object) => {
    const feature = feat as GeoFeature;
    const iso = feature.properties?.ISO_A2;
    const country = countries.find((c) => c.code === iso);
    if (!country) return "";
    return `<div style="background:rgba(0,0,0,0.85);color:#fff;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1)">
      <div style="font-size:10px;opacity:0.6;margin-bottom:2px;letter-spacing:0.1em">${country.code}</div>
      ${country.name}
      <div style="font-size:11px;opacity:0.5;margin-top:2px">${country.landmark}</div>
    </div>`;
  }, []);

  if (!geoData) {
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
        polygonsData={geoData.features}
        polygonAltitude={(d: object) => {
          const f = d as GeoFeature;
          return f.properties?.ISO_A2 === hovered ? 0.04 : 0.01;
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
