import { NextRequest, NextResponse } from "next/server";
import { getPeople, getPeopleByCountry, addPerson } from "@/lib/people";

export async function GET(request: NextRequest) {
  const countryCode = request.nextUrl.searchParams.get("country");

  try {
    const people = countryCode
      ? await getPeopleByCountry(countryCode)
      : await getPeople();

    return NextResponse.json(people);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, title, description, image_url, country_code } = body;

  if (!name || !title || !country_code) {
    return NextResponse.json(
      { error: "name, title, and country_code are required" },
      { status: 400 }
    );
  }

  try {
    const person = await addPerson({
      name,
      title,
      description: description || "",
      image_url: image_url || "",
      country_code,
    });
    return NextResponse.json(person, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
