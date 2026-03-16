"use client";

import { useState, useEffect, useCallback } from "react";
import { countries } from "@/data/countries";
import {
  Plus,
  Pencil,
  Trash2,
  User,
  Globe,
  Search,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

interface Person {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  countryCode: string;
}

export default function AdminPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [search, setSearch] = useState("");
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPeople = useCallback(async () => {
    setLoading(true);
    const params = selectedCountry ? `?country=${selectedCountry}` : "";
    const res = await fetch(`/api/people${params}`);
    const data = await res.json();
    setPeople(data);
    setLoading(false);
  }, [selectedCountry]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const filteredPeople = people.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.countryCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this person?")) return;
    await fetch(`/api/people/${id}`, { method: "DELETE" });
    fetchPeople();
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-20">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link
                href="/"
                className="text-neutral-400 hover:text-black transition-colors"
              >
                <Globe size={20} />
              </Link>
              <h1 className="text-3xl font-black tracking-tight">
                Backoffice
              </h1>
            </div>
            <p className="text-neutral-400 text-sm">
              Manage delegates for each country &middot;{" "}
              {people.length} total
            </p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingPerson(null);
            }}
            className="flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <Plus size={16} />
            Add Delegate
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
            />
            <input
              type="text"
              placeholder="Search delegates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-300 transition-all"
            />
          </div>
          <div className="relative">
            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none"
            />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="appearance-none bg-white border border-neutral-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-300 transition-all min-w-[200px]"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
            {error}
            <button onClick={() => setError("")}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {(isAdding || editingPerson) && (
          <PersonForm
            person={editingPerson}
            onSave={async (data) => {
              setError("");
              try {
                const url = editingPerson
                  ? `/api/people/${editingPerson.id}`
                  : "/api/people";
                const method = editingPerson ? "PUT" : "POST";
                const res = await fetch(url, {
                  method,
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });
                const result = await res.json();
                if (!res.ok) {
                  setError(result.error || "Something went wrong");
                  return;
                }
                setIsAdding(false);
                setEditingPerson(null);
                fetchPeople();
              } catch {
                setError("Network error");
              }
            }}
            onCancel={() => {
              setIsAdding(false);
              setEditingPerson(null);
            }}
          />
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-neutral-300">Loading...</div>
        ) : filteredPeople.length === 0 ? (
          <div className="text-center py-20">
            <User size={40} className="mx-auto text-neutral-200 mb-4" />
            <p className="text-neutral-400 text-sm">No delegates found</p>
            <p className="text-neutral-300 text-xs mt-1">
              Add your first delegate to get started
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left font-semibold text-neutral-400 text-xs tracking-wider uppercase px-6 py-4">
                    Delegate
                  </th>
                  <th className="text-left font-semibold text-neutral-400 text-xs tracking-wider uppercase px-6 py-4 hidden md:table-cell">
                    Title
                  </th>
                  <th className="text-left font-semibold text-neutral-400 text-xs tracking-wider uppercase px-6 py-4">
                    Country
                  </th>
                  <th className="text-right font-semibold text-neutral-400 text-xs tracking-wider uppercase px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPeople.map((person) => {
                  const country = countries.find(
                    (c) => c.code === person.countryCode
                  );
                  return (
                    <tr
                      key={person.id}
                      className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden">
                            {person.imageUrl ? (
                              <img
                                src={person.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={16} className="text-neutral-300" />
                            )}
                          </div>
                          <span className="font-semibold">{person.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">
                        {person.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-neutral-100 text-neutral-600 text-xs font-bold px-2.5 py-1 rounded-full">
                          {country?.name || person.countryCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingPerson(person);
                              setIsAdding(false);
                            }}
                            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-black"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(person.id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors text-neutral-400 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function PersonForm({
  person,
  onSave,
  onCancel,
}: {
  person: Person | null;
  onSave: (data: Omit<Person, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: person?.name || "",
    title: person?.title || "",
    description: person?.description || "",
    imageUrl: person?.imageUrl || "",
    countryCode: person?.countryCode || "",
  });

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
      <h3 className="font-bold text-lg mb-4">
        {person ? "Edit Delegate" : "Add New Delegate"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
            Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-300"
            placeholder="Full name"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-300"
            placeholder="e.g. CEO of Company"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
            Country *
          </label>
          <select
            value={form.countryCode}
            onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-300"
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
            Image URL
          </label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-300"
            placeholder="https://..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={3}
            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-300 resize-none"
            placeholder="Short bio..."
          />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => onSave(form as Omit<Person, "id">)}
          className="flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors"
        >
          <Check size={14} />
          {person ? "Update" : "Create"}
        </button>
        <button
          onClick={onCancel}
          className="text-sm font-semibold text-neutral-400 px-5 py-2.5 rounded-full hover:bg-neutral-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
