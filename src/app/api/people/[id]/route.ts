import { NextRequest, NextResponse } from "next/server";
import { updatePerson, deletePerson } from "@/lib/people";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const person = await updatePerson(id, body);
    return NextResponse.json(person);
  } catch {
    return NextResponse.json({ error: "Person not found" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await deletePerson(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Person not found" }, { status: 404 });
  }
}
