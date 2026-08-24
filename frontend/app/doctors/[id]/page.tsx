"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  hospital?: string;
  experience?: string;
  city?: string;
  image?: string;
};

export default function DoctorDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError("");

       const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/${params.id}`
);

        if (!response.ok) {
          throw new Error("Doctor not found");
        }

        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load doctor details.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDoctor();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8ff] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#DFC5FE] border-t-[#6D28D9] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading doctor details...</p>
        </div>
      </main>
    );
  }

  if (error || !doctor) {
    return (
      <main className="min-h-screen bg-[#faf8ff] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md">
          <div className="text-5xl mb-4">👨‍⚕️</div>

          <h1 className="text-2xl font-bold text-slate-900">
            Doctor Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            We couldn't find the doctor you're looking for.
          </p>

          <button
            onClick={() => router.push("/doctors")}
            className="mt-6 px-6 py-3 rounded-xl bg-[#DFC5FE] text-[#4C1D95] font-semibold hover:bg-[#C9A7F5] transition"
          >
            Back to Doctors
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8ff]">

      {/* HEADER */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">

          <button
            onClick={() => router.push("/doctors")}
            className="text-sm text-[#6D28D9] font-semibold hover:underline"
          >
            ← Back to Doctors
          </button>

        </div>
      </section>

      {/* DOCTOR PROFILE */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid lg:grid-cols-[320px_1fr] gap-8">

          {/* PROFILE CARD */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">

            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden bg-[#F1E8FF] flex items-center justify-center">

              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">👨‍⚕️</span>
              )}

            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              {doctor.name}
            </h2>

            <p className="mt-2 text-[#2563A6] font-semibold">
              {doctor.specialty}
            </p>

            {doctor.experience && (
              <p className="mt-4 text-sm text-gray-500">
                {doctor.experience} experience
              </p>
            )}

          </div>

          {/* DETAILS */}
          <div className="space-y-6">

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

              <div className="flex items-start justify-between gap-6">

                <div>
                  <p className="text-sm text-[#6D28D9] font-semibold">
                    VERIFIED SPECIALIST
                  </p>

                  <h1 className="mt-2 text-4xl font-bold text-slate-900">
                    {doctor.name}
                  </h1>

                  <p className="mt-3 text-lg text-gray-600">
                    {doctor.specialty}
                  </p>
                </div>

                <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-[#F1E8FF] items-center justify-center text-2xl">
                  ✓
                </div>

              </div>

              {/* INFO */}
              <div className="grid sm:grid-cols-2 gap-4 mt-8">

                <div className="rounded-2xl bg-[#faf8ff] p-5">
                  <p className="text-sm text-gray-500">
                    Hospital
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {doctor.hospital || "Available at partner hospitals"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf8ff] p-5">
                  <p className="text-sm text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {doctor.city || "India"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf8ff] p-5">
                  <p className="text-sm text-gray-500">
                    Specialty
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {doctor.specialty}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf8ff] p-5">
                  <p className="text-sm text-gray-500">
                    Experience
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {doctor.experience || "Experienced Specialist"}
                  </p>
                </div>

              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">

                <button
                  onClick={() => router.push("/appointment")}
                  className="flex-1 px-6 py-4 rounded-xl bg-[#DFC5FE] text-[#4C1D95] font-bold hover:bg-[#C9A7F5] transition shadow-sm"
                >
                  Book Consultation
                </button>

                <button
                  onClick={() => router.push("/doctors")}
                  className="px-6 py-4 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:border-[#DFC5FE] transition"
                >
                  View Other Doctors
                </button>

              </div>

            </div>

            {/* ABOUT */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

              <h2 className="text-2xl font-bold text-slate-900">
                About the Doctor
              </h2>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Consult with experienced medical professionals through
                MediIndia Care. Our doctors provide trusted expertise and
                personalized care for international patients seeking
                quality treatment in India.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}