import { NextRequest, NextResponse } from "next/server";
import { getPeople, getPeopleByCountry, addPerson } from "@/lib/people";

export async function GET(request: NextRequest) {
  const countryCode = request.nextUrl.searchParams.get("country");

  const people = countryCode
    ? await getPeopleByCountry(countryCode)
    : await getPeople();

  return NextResponse.json(people);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, title, description, imageUrl, countryCode } = body;

  if (!name || !title || !countryCode) {
    return NextResponse.json(
      { error: "name, title, and countryCode are required" },
      { status: 400 }
    );
  }

  try {
    const person = await addPerson({
      name,
      title,
      description: description || "",
      imageUrl: imageUrl || "",
      countryCode,
    });
    return NextResponse.json(person, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
