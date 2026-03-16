import { getCountryByCode, countries } from "@/data/countries";
import { getPeopleByCountry } from "@/lib/people";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CountryContent from "./CountryContent";

export async function generateStaticParams() {
  return countries.map((c) => ({ code: c.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const country = getCountryByCode(code);
  if (!country) return { title: "Country Not Found" };
  return {
    title: `${country.name} — NEXTWORLD Delegates`,
    description: `Meet the 5 delegates representing ${country.name} at NEXTWORLD`,
  };
}

export const dynamic = "force-dynamic";

export default async function CountryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const country = getCountryByCode(code);
  if (!country) notFound();

  const people = await getPeopleByCountry(code);

  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${country.landmarkImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />

        <div className="absolute top-24 left-6 md:left-12 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Globe
          </Link>
        </div>

        <div className="absolute bottom-12 left-6 md:left-12 z-10">
          <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase mb-2">
            {country.code} &middot; {country.landmark}
          </p>
          <h1 className="text-white text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter">
            {country.name}
          </h1>
          <p className="text-white/40 text-sm mt-2">
            {people.length}/5 delegates selected
          </p>
        </div>
      </div>

      <CountryContent country={country} initialPeople={people} />
    </div>
  );
}
