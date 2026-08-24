"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Hospital = {
  id?: string | number;
  name: string;
  city: string;
  specialty: string;
  address?: string;
  image?: string;
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All Cities");
  const [specialty, setSpecialty] = useState("All Specialties");

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/hospitals`
       );
        if (!response.ok) {
          throw new Error("Failed to fetch hospitals");
        }

        const data = await response.json();

        setHospitals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load hospitals. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // Unique cities
  const cities = useMemo(() => {
    return [
      "All Cities",
      ...Array.from(
        new Set(hospitals.map((hospital) => hospital.city).filter(Boolean))
      ),
    ];
  }, [hospitals]);

  // Unique specialties
  const specialties = useMemo(() => {
    return [
      "All Specialties",
      ...Array.from(
        new Set(
          hospitals
            .map((hospital) => hospital.specialty)
            .filter(Boolean)
        )
      ),
    ];
  }, [hospitals]);

  // Search + filters
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        hospital.name?.toLowerCase().includes(searchText) ||
        hospital.city?.toLowerCase().includes(searchText) ||
        hospital.specialty?.toLowerCase().includes(searchText);

      const matchesCity =
        city === "All Cities" || hospital.city === city;

      const matchesSpecialty =
        specialty === "All Specialties" ||
        hospital.specialty === specialty;

      return matchesSearch && matchesCity && matchesSpecialty;
    });
  }, [hospitals, search, city, specialty]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#DFC5FE]/5 to-white">

      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden">

        {/* Lavender glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#DFC5FE]/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 pt-16 pb-10">

          <div className="max-w-3xl">

            <span className="inline-flex items-center gap-2 bg-[#DFC5FE]/20 border border-[#DFC5FE]/50 text-[#6D28D9] px-4 py-2 rounded-full text-sm font-semibold">
              Trusted Healthcare in India
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl font-bold text-slate-900">
              Find the Right{" "}
              <span className="text-[#2563A6]">
                Hospital
              </span>
            </h1>

            <p className="mt-4 text-gray-500 text-base sm:text-lg leading-relaxed">
              Explore trusted hospitals across India and find the right
              healthcare provider for your treatment.
            </p>

          </div>


          {/* Search + Filters */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.08)] p-4">

            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-3">

              {/* Search */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#DFC5FE] transition">

                <span className="text-[#2563A6] text-lg">
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search hospitals, cities or specialties..."
                  className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />

              </div>


              {/* City */}
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 outline-none focus:border-[#DFC5FE]"
              >
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>


              {/* Specialty */}
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 outline-none focus:border-[#DFC5FE]"
              >
                {specialties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>

      </section>


      {/* Hospital Results */}
      <section className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 pb-20">

        {/* Result Header */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6">

            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredHospitals.length}
              </span>{" "}
              hospitals
            </p>

          </div>
        )}


        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />

                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-10 bg-gray-200 rounded mt-5" />
                </div>
              </div>
            ))}

          </div>
        )}


        {/* Error */}
        {!loading && error && (
          <div className="bg-white border border-red-100 rounded-2xl p-10 text-center">

            <div className="text-4xl mb-4">
              ⚠️
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Something went wrong
            </h2>

            <p className="mt-2 text-gray-500">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 rounded-xl bg-[#DFC5FE] text-[#4C1D95] font-semibold hover:bg-[#C9A7F5] transition"
            >
              Try Again
            </button>

          </div>
        )}


        {/* No Results */}
        {!loading &&
          !error &&
          filteredHospitals.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">

              <div className="text-5xl mb-4">
                🏥
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                No hospitals found
              </h2>

              <p className="mt-2 text-gray-500">
                Try changing your search or filters.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCity("All Cities");
                  setSpecialty("All Specialties");
                }}
                className="mt-6 px-6 py-3 rounded-xl bg-[#DFC5FE] text-[#4C1D95] font-semibold"
              >
                Clear Filters
              </button>

            </div>
          )}


        {/* Hospital Cards */}
        {!loading &&
          !error &&
          filteredHospitals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredHospitals.map((hospital, index) => (

                <article
                  key={hospital.id ?? `${hospital.name}-${index}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >

                  {/* Image */}
                  <div className="relative h-52 bg-[#DFC5FE]/10 overflow-hidden">

                    {hospital.image ? (
                      <img
                        src={hospital.image}
                        alt={hospital.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#DFC5FE]/30 to-blue-50">
                        <span className="text-6xl">
                          🏥
                        </span>
                      </div>
                    )}

                  </div>


                  {/* Content */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#2563A6] transition-colors">
                          {hospital.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          📍 {hospital.city}
                        </p>

                      </div>

                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#DFC5FE]/15 text-[#6D28D9] text-xs font-semibold">
                        Verified
                      </span>

                    </div>


                    {/* Specialty */}
                    <div className="mt-4">

                      <span className="inline-flex px-3 py-1.5 rounded-lg bg-blue-50 text-[#2563A6] text-xs font-medium">
                        {hospital.specialty}
                      </span>

                    </div>


                    {/* Address */}
                    {hospital.address && (
                      <p className="mt-4 text-sm text-gray-500 line-clamp-2">
                        {hospital.address}
                      </p>
                    )}


                    {/* Button */}
                    <Link
                      href={`/hospitals/${hospital.id}`}
                      className="mt-5 flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-[#DFC5FE] text-[#4C1D95] font-semibold text-sm hover:bg-[#C9A7F5] transition"
                    >
                      View Hospital Details
                      <span>→</span>
                    </Link>

                  </div>

                </article>

              ))}

            </div>
          )}

      </section>

    </main>
  );
}