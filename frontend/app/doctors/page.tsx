"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

type Doctor = {
  id: number;
  name: string;
  specialty?: string;
  hospital?: string;
  city?: string;
  experience?: number;
  image?: string;
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`);

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specialties = [
    "All Specialties",
    ...Array.from(
      new Set(
        doctors
          .map((doctor) => doctor.specialty)
          .filter(Boolean)
      )
    ),
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      doctor.name?.toLowerCase().includes(searchText) ||
      doctor.specialty?.toLowerCase().includes(searchText) ||
      doctor.hospital?.toLowerCase().includes(searchText) ||
      doctor.city?.toLowerCase().includes(searchText);

    const matchesSpecialty =
      specialty === "All Specialties" ||
      doctor.specialty === specialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HEADER */}
      <section className="bg-gradient-to-br from-white via-[#DFC5FE]/10 to-[#DFC5FE]/25">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-20">

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-[#DFC5FE]/30 border border-[#DFC5FE]/60 text-[#6D28D9] px-4 py-2 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
              Trusted Medical Experts
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
              Find the Right{" "}
              <span className="text-[#2563A6]">Doctor</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
              Connect with experienced doctors and medical specialists
              from leading hospitals across India.
            </p>
          </div>

          {/* SEARCH + FILTER */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-[0_12px_35px_rgba(0,0,0,0.08)] p-3">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3">

              {/* Search */}
              <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus-within:border-[#DFC5FE] focus-within:ring-2 focus-within:ring-[#DFC5FE]/30">
                <span className="text-xl text-[#2563A6]">⌕</span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search doctor, specialty, hospital..."
                  className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
              </div>

              {/* Specialty */}
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="px-5 py-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 outline-none focus:border-[#DFC5FE] focus:ring-2 focus:ring-[#DFC5FE]/30"
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

      {/* DOCTORS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Our Doctors
            </h2>

            {!loading && !error && (
              <p className="text-sm text-gray-500 mt-1">
                {filteredDoctors.length} doctor
                {filteredDoctors.length !== 1 ? "s" : ""} available
              </p>
            )}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse"
              >
                <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto" />

                <div className="h-5 bg-gray-200 rounded mt-5 w-2/3 mx-auto" />
                <div className="h-4 bg-gray-200 rounded mt-3 w-1/2 mx-auto" />

                <div className="h-10 bg-gray-200 rounded-xl mt-6" />
              </div>
            ))}

          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <div className="text-3xl">⚠️</div>

            <h3 className="mt-3 font-semibold text-red-800">
              Something went wrong
            </h3>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 px-5 py-2.5 rounded-lg bg-[#DFC5FE] text-[#4C1D95] font-semibold hover:bg-[#C9A7F5] transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-[#DFC5FE]/10 p-12 text-center">
            <div className="text-4xl">🔎</div>

            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              No doctors found
            </h3>

            <p className="mt-2 text-gray-500">
              Try changing your search or specialty filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSpecialty("All Specialties");
              }}
              className="mt-5 text-sm font-semibold text-[#6D28D9] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* DOCTOR CARDS */}
        {!loading && !error && filteredDoctors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_15px_35px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >

                {/* Lavender top */}
                <div className="h-24 bg-gradient-to-r from-[#DFC5FE]/40 to-[#DFC5FE]/10 relative" />

                {/* Doctor Image */}
                <div className="-mt-12 px-6">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#DFC5FE]/30 flex items-center justify-center">

                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-[#6D28D9]">
                        {doctor.name?.charAt(0).toUpperCase()}
                      </span>
                    )}

                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">

                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    {doctor.name}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-[#6D28D9]">
                    {doctor.specialty || "Medical Specialist"}
                  </p>

                  <div className="mt-5 space-y-3 text-sm text-gray-600">

                    {doctor.hospital && (
                      <div className="flex items-start gap-3">
                        <span className="text-[#2563A6]">✚</span>
                        <span>{doctor.hospital}</span>
                      </div>
                    )}

                    {doctor.city && (
                      <div className="flex items-center gap-3">
                        <span className="text-[#2563A6]">⌖</span>
                        <span>{doctor.city}</span>
                      </div>
                    )}

                    {doctor.experience !== undefined && (
                      <div className="flex items-center gap-3">
                        <span className="text-[#2563A6]">★</span>
                        <span>
                          {doctor.experience}+ years experience
                        </span>
                      </div>
                    )}

                  </div>

                  <a
                    href={`/doctors/${doctor.id}`}
                    className="mt-6 block w-full text-center px-5 py-3 rounded-xl bg-[#DFC5FE] text-[#4C1D95] font-semibold text-sm hover:bg-[#C9A7F5] transition-all"
                  >
                    View Profile
                  </a>

                </div>
              </article>
            ))}

          </div>
        )}

      </section>
    </main>
  );
}