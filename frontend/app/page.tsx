"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";
import WhyChooseIndia from "@/components/WhyChooseIndia";
import PopularTreatments from "@/components/PopularTreatments";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import AIRecommendationWidget from "@/components/AIRecommendationWidget";

type Doctor = {
  id: number;
  name: string;
  specialization: string;
  hospital: string;
  experience: string;
};

type Hospital = {
  id: number;
  name: string;
  city: string;
  specialty: string;
  address: string;
  image?: string;
};

type Treatment = {
  id: number;
  name: string;
  specialty: string;
  description: string;
  estimated_cost: string;
  duration: string;
};

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [searchResults, setSearchResults] = useState<{
    doctors: Doctor[];
    hospitals: Hospital[];
    treatments: Treatment[];
  }>({
    doctors: [],
    hospitals: [],
    treatments: [],
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [apiError, setApiError] = useState("");

  // ==========================================
  // FETCH REAL DATA FROM BACKEND
  // ==========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setApiError("");

        const [doctorsResponse, hospitalsResponse, treatmentsResponse] =
          await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hospitals`),   
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/treatments`),
          ]);

        if (
          !doctorsResponse.ok ||
          !hospitalsResponse.ok ||
          !treatmentsResponse.ok
        ) {
          throw new Error("Unable to load healthcare data.");
        }

        const doctorsData = await doctorsResponse.json();
        const hospitalsData = await hospitalsResponse.json();
        const treatmentsData = await treatmentsResponse.json();

        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
        setHospitals(Array.isArray(hospitalsData) ? hospitalsData : []);
        setTreatments(Array.isArray(treatmentsData) ? treatmentsData : []);
      } catch (error) {
        console.error("Search data error:", error);

        setApiError(
          error instanceof Error
            ? error.message
            : "Unable to load healthcare data."
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // ==========================================
  // CITY OPTIONS
  // ==========================================

  const cities = Array.from(
    new Set(
      hospitals
        .map((hospital) => hospital.city)
        .filter(Boolean)
    )
  ).sort();

  // ==========================================
  // CATEGORY OPTIONS
  // ==========================================

  const categories = Array.from(
    new Set([
      ...treatments
        .map((treatment) => treatment.specialty)
        .filter(Boolean),

      ...doctors
        .map((doctor) => doctor.specialization)
        .filter(Boolean),
    ])
  ).sort();

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();

    const filteredDoctors = doctors.filter((doctor) => {
      const matchesSearch =
        !query ||
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query) ||
        doctor.hospital.toLowerCase().includes(query);

      const matchesCategory =
        !selectedCategory ||
        doctor.specialization.toLowerCase() ===
          selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    const filteredHospitals = hospitals.filter((hospital) => {
      const matchesSearch =
        !query ||
        hospital.name.toLowerCase().includes(query) ||
        hospital.city.toLowerCase().includes(query) ||
        hospital.specialty.toLowerCase().includes(query) ||
        hospital.address.toLowerCase().includes(query);

      const matchesCity =
        !selectedCity ||
        hospital.city.toLowerCase() === selectedCity.toLowerCase();

      const matchesCategory =
        !selectedCategory ||
        hospital.specialty.toLowerCase() ===
          selectedCategory.toLowerCase();

      return matchesSearch && matchesCity && matchesCategory;
    });

    const filteredTreatments = treatments.filter((treatment) => {
      const matchesSearch =
        !query ||
        treatment.name.toLowerCase().includes(query) ||
        treatment.specialty.toLowerCase().includes(query) ||
        treatment.description.toLowerCase().includes(query);

      const matchesCategory =
        !selectedCategory ||
        treatment.specialty.toLowerCase() ===
          selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    setSearchResults({
      doctors: filteredDoctors,
      hospitals: filteredHospitals,
      treatments: filteredTreatments,
    });

    setHasSearched(true);
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCity("");
    setSelectedCategory("");
    setSearchResults({
      doctors: [],
      hospitals: [],
      treatments: [],
    });
    setHasSearched(false);
  };

  const totalResults =
    searchResults.doctors.length +
    searchResults.hospitals.length +
    searchResults.treatments.length;

  return (
    <main className="bg-white scroll-smooth">
      <Navbar />

      {/* ==========================================
          HERO + STATS
      ========================================== */}

      <section
  id="home"
  className="relative scroll-mt-24 overflow-hidden bg-white"
>

        {/* Taj Mahal Background */}

        <div className="absolute top-0 right-0 h-[720px] w-full lg:w-[64%] overflow-hidden">

          <img
            src="/images/taj-mahal.jpg"
            alt="Taj Mahal"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Strong White → Image Blend */}

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:from-white lg:via-white/35 lg:to-transparent" />

          {/* Bottom Fade */}

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

          {/* Lavender Tint */}

          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#DFC5FE]/10" />

        </div>

        {/* HERO CONTENT */}

        <div className="relative z-10 max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">

          <div className="min-h-[650px] flex items-center">

            <div className="w-full lg:w-[68%] py-16 lg:py-20">

              {/* Badge */}

              <div className="inline-flex items-center gap-2 bg-[#DFC5FE]/25 border border-[#DFC5FE]/60 text-[#6D28D9] px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">

                <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />

                Trusted Healthcare • World-Class Treatment

              </div>

              {/* Heading */}

              <h1 className="mt-7 text-4xl sm:text-5xl lg:text-6xl xl:text-[62px] font-bold leading-[1.06] tracking-tight text-slate-900 max-w-3xl">

                Your Journey to Better{" "}

                <span className="text-[#2563A6]">
                  Health
                </span>{" "}

                Starts in India

              </h1>

              {/* Description */}

              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-600">

                Find world-class hospitals, expert doctors and affordable
                treatments in India. We make your medical journey simple,
                transparent and secure.

              </p>

              {/* ==========================================
                  FUNCTIONAL SEARCH BAR
              ========================================== */}

              <div className="mt-9 w-full max-w-[900px]">

                <div className="rounded-2xl border border-white/80 bg-white/90 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-3">

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] gap-3">

                    {/* Search */}

                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white">

                      <span className="text-[#2563A6] text-lg">
                        ⌕
                      </span>

                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) =>
                          setSearchQuery(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                        placeholder="Search treatments, hospitals..."
                        className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                      />

                    </div>

                    {/* City */}

                    <div className="relative">

                      <select
                        value={selectedCity}
                        onChange={(e) =>
                          setSelectedCity(e.target.value)
                        }
                        className="w-full appearance-none px-4 py-3 pl-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 outline-none cursor-pointer hover:border-[#DFC5FE] focus:border-[#DFC5FE] focus:ring-2 focus:ring-[#DFC5FE]/30"
                      >

                        <option value="">
                          Select City
                        </option>

                        {cities.map((city) => (
                          <option
                            key={city}
                            value={city}
                          >
                            {city}
                          </option>
                        ))}

                      </select>

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563A6] pointer-events-none">
                        ⌖
                      </span>

                    </div>

                    {/* Category */}

                    <div className="relative">

                      <select
                        value={selectedCategory}
                        onChange={(e) =>
                          setSelectedCategory(e.target.value)
                        }
                        className="w-full appearance-none px-4 py-3 pl-10 pr-9 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 outline-none cursor-pointer hover:border-[#DFC5FE] focus:border-[#DFC5FE] focus:ring-2 focus:ring-[#DFC5FE]/30"
                      >

                        <option value="">
                          All Categories
                        </option>

                        {categories.map((category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        ))}

                      </select>

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563A6] pointer-events-none">
                        ✚
                      </span>

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        ⌄
                      </span>

                    </div>

                    {/* Search Button */}

                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={loadingData}
                      className="px-7 py-3 rounded-xl bg-[#DFC5FE] text-[#4C1D95] font-semibold hover:bg-[#C9A7F5] transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingData ? "Loading..." : "Search"}
                    </button>

                  </div>

                </div>

              </div>

              {/* Trust Points */}

              <div className="flex flex-wrap gap-x-7 gap-y-3 mt-6 text-sm text-gray-600">

                <span className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">
                    ✓
                  </span>
                  Verified Hospitals
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">
                    ✓
                  </span>
                  Expert Doctors
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">
                    ✓
                  </span>
                  Affordable Treatment
                </span>

              </div>

            </div>

          </div>

          {/* ==========================================
              SEARCH RESULTS
          ========================================== */}

          {hasSearched && (

            <div
              id="search-results"
              className="relative z-30 pb-12"
            >

              <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                  <div>

                    <h2 className="text-2xl font-bold text-slate-900">
                      Search Results
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {totalResults} result
                      {totalResults !== 1 ? "s" : ""} found
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={clearSearch}
                    className="self-start sm:self-auto px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Clear Search
                  </button>

                </div>

                {/* Error */}

                {apiError && (

                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {apiError}
                  </div>

                )}

                {/* No Results */}

                {!apiError && totalResults === 0 && (

                  <div className="rounded-xl bg-slate-50 border border-gray-200 p-8 text-center">

                    <h3 className="text-lg font-semibold text-slate-800">
                      No results found
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Try a different treatment, hospital, doctor,
                      city or category.
                    </p>

                  </div>

                )}

                {/* ==========================================
                    HOSPITAL RESULTS
                ========================================== */}

                {searchResults.hospitals.length > 0 && (

                  <div className="mb-8">

                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Hospitals
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">

                      {searchResults.hospitals.map((hospital) => (

                        <div
                          key={hospital.id}
                          className="rounded-xl border border-gray-200 p-5 hover:border-[#DFC5FE] hover:shadow-sm transition"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <h4 className="font-bold text-slate-900">
                                {hospital.name}
                              </h4>

                              <p className="mt-1 text-sm text-[#2563A6]">
                                {hospital.specialty}
                              </p>

                            </div>

                            <span className="rounded-lg bg-[#DFC5FE]/30 px-3 py-1 text-xs font-semibold text-[#6D28D9]">
                              Hospital
                            </span>

                          </div>

                          <p className="mt-3 text-sm text-gray-600">
                            {hospital.city}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {hospital.address}
                          </p>

                        </div>

                      ))}

                    </div>

                  </div>

                )}

                {/* ==========================================
                    DOCTOR RESULTS
                ========================================== */}

                {searchResults.doctors.length > 0 && (

                  <div className="mb-8">

                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Doctors
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">

                      {searchResults.doctors.map((doctor) => (

                        <div
                          key={doctor.id}
                          className="rounded-xl border border-gray-200 p-5 hover:border-[#DFC5FE] hover:shadow-sm transition"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <h4 className="font-bold text-slate-900">
                                {doctor.name}
                              </h4>

                              <p className="mt-1 text-sm text-[#2563A6]">
                                {doctor.specialization}
                              </p>

                            </div>

                            <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2563A6]">
                              Doctor
                            </span>

                          </div>

                          <p className="mt-3 text-sm text-gray-600">
                            {doctor.hospital}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Experience: {doctor.experience}
                          </p>

                        </div>

                      ))}

                    </div>

                  </div>

                )}

                {/* ==========================================
                    TREATMENT RESULTS
                ========================================== */}

                {searchResults.treatments.length > 0 && (

                  <div>

                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Treatments
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">

                      {searchResults.treatments.map((treatment) => (

                        <div
                          key={treatment.id}
                          className="rounded-xl border border-gray-200 p-5 hover:border-[#DFC5FE] hover:shadow-sm transition"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <h4 className="font-bold text-slate-900">
                                {treatment.name}
                              </h4>

                              <p className="mt-1 text-sm text-[#2563A6]">
                                {treatment.specialty}
                              </p>

                            </div>

                            <span className="rounded-lg bg-[#DFC5FE]/30 px-3 py-1 text-xs font-semibold text-[#6D28D9]">
                              Treatment
                            </span>

                          </div>

                          <p className="mt-3 text-sm text-gray-600">
                            {treatment.description}
                          </p>

                          <div className="flex flex-wrap gap-4 mt-4 text-sm">

                            <span className="font-semibold text-slate-800">
                              {treatment.estimated_cost}
                            </span>

                            <span className="text-gray-500">
                              {treatment.duration}
                            </span>

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>

                )}

              </div>

            </div>

          )}

          {/* ==========================================
              FLOATING STATS
          ========================================== */}

          <div className="relative z-20 pb-14">

            <Stats />

          </div>

        </div>

      </section>

      {/* ==========================================
          OTHER SECTIONS
      ========================================== */}

   {/* ABOUT INDIA */}
<section id="about-india" className="scroll-mt-24">
  <WhyChooseIndia />
</section>

{/* POPULAR TREATMENTS */}
<section id="treatments" className="scroll-mt-24">
  <PopularTreatments />
</section>

{/* HOW IT WORKS */}
<section id="how-it-works" className="scroll-mt-24">
  <HowItWorks />
</section>

{/* CONTACT / CTA */}
<section id="contact" className="scroll-mt-24">
  <CTASection />
</section>

{/* AI RECOMMENDATION */}
<AIRecommendationWidget />

    

    </main>
  );
}