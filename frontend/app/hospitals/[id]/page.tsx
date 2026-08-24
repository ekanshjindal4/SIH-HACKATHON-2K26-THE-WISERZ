"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Hospital {
  id: number;
  name: string;
  city: string;
  specialty: string;
  address: string;
  image: string;
}

export default function HospitalDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/hospitals/${params.id}`
);

        if (!response.ok) {
          throw new Error("Hospital not found");
        }

        const data = await response.json();
        setHospital(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load hospital details.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchHospital();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FCFAFF]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded-lg" />
            <div className="h-72 bg-gray-200 rounded-3xl" />
            <div className="h-32 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !hospital) {
    return (
      <main className="min-h-screen bg-[#FCFAFF] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-5">🏥</div>

          <h1 className="text-2xl font-bold text-slate-900">
            Hospital Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            We couldn't find the hospital you're looking for.
          </p>

          <button
            onClick={() => router.push("/hospitals")}
            className="mt-6 px-6 py-3 rounded-xl bg-[#DFC5FE] text-[#4C1D95] font-semibold hover:bg-[#C9A7F5] transition"
          >
            ← Back to Hospitals
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFAFF]">
      
      {/* Header */}
      <section className="border-b border-[#DFC5FE]/30 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <button
            onClick={() => router.push("/hospitals")}
            className="text-sm font-medium text-gray-600 hover:text-[#6D28D9] transition"
          >
            ← Back to Hospitals
          </button>
        </div>
      </section>

      {/* Hospital Hero */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F8F1FF] via-white to-[#EAF4FF] border border-[#DFC5FE]/40 shadow-sm">

          <div className="grid lg:grid-cols-2">

            {/* Hospital Image */}
            <div className="h-[300px] lg:h-[400px]">
              {hospital.image ? (
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#DFC5FE]/40 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-4xl">
                      🏥
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                      Hospital Image
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Hospital Information */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">

              <span className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full bg-[#DFC5FE]/30 text-[#6D28D9] text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                Verified Healthcare Provider
              </span>

              <h1 className="mt-5 text-3xl lg:text-5xl font-bold text-slate-900 leading-tight">
                {hospital.name}
              </h1>

              <div className="mt-5 space-y-3">

                <div className="flex items-center gap-3 text-gray-600">
                  <span className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    📍
                  </span>
                  <span>{hospital.city}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <span className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    🏆
                  </span>
                  <span>{hospital.specialty}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <span className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    🏥
                  </span>
                  <span>{hospital.address}</span>
                </div>

              </div>

              <button
                onClick={() =>
                  router.push(
                    `/appointment?hospital=${hospital.id}`
                  )
                }
                className="mt-8 w-fit px-7 py-3.5 rounded-xl bg-[#DFC5FE] text-[#4C1D95] font-bold hover:bg-[#C9A7F5] hover:shadow-lg transition-all"
              >
                Book Appointment →
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Quick Information */}
      <section className="max-w-7xl mx-auto px-6 pb-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <InfoCard
            icon="🏥"
            title="Specialty"
            value={hospital.specialty}
          />

          <InfoCard
            icon="📍"
            title="Location"
            value={hospital.city}
          />

          <InfoCard
            icon="🩺"
            title="Expert Care"
            value="Qualified Doctors"
          />

          <InfoCard
            icon="✓"
            title="Patient Support"
            value="International Patients"
          />

        </div>
      </section>

      {/* About Hospital */}
      <section className="max-w-7xl mx-auto px-6 pb-16">

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-10">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#DFC5FE]/30 flex items-center justify-center text-[#6D28D9]">
              🏥
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                About {hospital.name}
              </h2>

              <p className="text-sm text-gray-500">
                World-class healthcare in India
              </p>
            </div>
          </div>

          <p className="text-gray-600 leading-8 max-w-4xl">
            {hospital.name} is a healthcare provider located in{" "}
            <strong>{hospital.city}</strong>, offering{" "}
            <strong>{hospital.specialty}</strong> services to patients.
            Our platform helps international patients discover trusted
            hospitals, compare treatment options and connect with healthcare
            professionals.
          </p>

          {/* Facilities */}
          <div className="mt-10">
            <h3 className="text-lg font-bold text-slate-900 mb-5">
              Hospital Facilities
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {[
                "24/7 Emergency Care",
                "Modern Medical Equipment",
                "International Patient Support",
                "Specialist Doctors",
              ].map((facility) => (
                <div
                  key={facility}
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#FCFAFF] border border-[#DFC5FE]/30"
                >
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-sm text-gray-700">
                    {facility}
                  </span>
                </div>
              ))}

            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-16">

        <div className="rounded-3xl bg-gradient-to-r from-[#DFC5FE] to-[#EDE2FF] p-8 lg:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <h2 className="text-2xl font-bold text-[#2E1065]">
              Ready to start your treatment journey?
            </h2>

            <p className="mt-2 text-[#5B21B6]/80">
              Connect with trusted healthcare professionals in India.
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                `/appointment?hospital=${hospital.id}`
              )
            }
            className="shrink-0 px-7 py-3.5 rounded-xl bg-white text-[#5B21B6] font-bold shadow-sm hover:shadow-md transition"
          >
            Book Appointment →
          </button>

        </div>

      </section>

    </main>
  );
}


/* Reusable Info Card */

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-[#DFC5FE] transition-all">

      <div className="w-11 h-11 rounded-xl bg-[#DFC5FE]/25 flex items-center justify-center text-lg">
        {icon}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-1 font-semibold text-slate-900">
        {value}
      </p>

    </div>
  );
}