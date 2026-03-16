import { readFile, writeFile } from "fs/promises";
import path from "path";

export interface Person {
  id: string;
  countryCode: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
}

const DATA_PATH = path.join(process.cwd(), "src", "data", "people.json");

export async function getPeople(): Promise<Person[]> {
  const raw = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Person[];
}

export async function getPeopleByCountry(code: string): Promise<Person[]> {
  const all = await getPeople();
  return all.filter((p) => p.countryCode === code.toUpperCase());
}

export async function addPerson(
  data: Omit<Person, "id">
): Promise<Person> {
  const all = await getPeople();
  const countryCount = all.filter(
    (p) => p.countryCode === data.countryCode.toUpperCase()
  ).length;

  if (countryCount >= 5) {
    throw new Error("Maximum 5 people per country");
  }

  const person: Person = {
    ...data,
    id: `${data.countryCode.toLowerCase()}_${Date.now()}`,
    countryCode: data.countryCode.toUpperCase(),
  };

  all.push(person);
  await writeFile(DATA_PATH, JSON.stringify(all, null, 2), "utf-8");
  return person;
}

export async function updatePerson(
  id: string,
  data: Partial<Omit<Person, "id">>
): Promise<Person> {
  const all = await getPeople();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Person not found");

  all[idx] = { ...all[idx], ...data };
  if (data.countryCode) {
    all[idx].countryCode = data.countryCode.toUpperCase();
  }
  await writeFile(DATA_PATH, JSON.stringify(all, null, 2), "utf-8");
  return all[idx];
}

export async function deletePerson(id: string): Promise<void> {
  const all = await getPeople();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) throw new Error("Person not found");
  await writeFile(DATA_PATH, JSON.stringify(filtered, null, 2), "utf-8");
}
