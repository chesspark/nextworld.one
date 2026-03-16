import { supabaseAdmin } from "./supabase";

export interface Person {
  id: string;
  country_code: string;
  name: string;
  title: string;
  description: string;
  image_url: string;
  created_at?: string;
}

export async function getPeople(): Promise<Person[]> {
  const { data, error } = await supabaseAdmin
    .from("people")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getPeopleByCountry(code: string): Promise<Person[]> {
  const { data, error } = await supabaseAdmin
    .from("people")
    .select("*")
    .eq("country_code", code.toUpperCase())
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addPerson(
  data: Omit<Person, "id" | "created_at">
): Promise<Person> {
  const { data: existing } = await supabaseAdmin
    .from("people")
    .select("id")
    .eq("country_code", data.country_code.toUpperCase());

  if (existing && existing.length >= 5) {
    throw new Error("Maximum 5 people per country");
  }

  const { data: person, error } = await supabaseAdmin
    .from("people")
    .insert({
      ...data,
      country_code: data.country_code.toUpperCase(),
    })
    .select()
    .single();

  if (error) throw error;
  return person;
}

export async function updatePerson(
  id: string,
  updates: Partial<Omit<Person, "id" | "created_at">>
): Promise<Person> {
  const cleanUpdates = { ...updates, updated_at: new Date().toISOString() };
  if (cleanUpdates.country_code) {
    cleanUpdates.country_code = cleanUpdates.country_code.toUpperCase();
  }

  const { data: person, error } = await supabaseAdmin
    .from("people")
    .update(cleanUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return person;
}

export async function deletePerson(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("people")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
