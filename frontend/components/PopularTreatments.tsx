import Link from "next/link";

const treatments = [
  {
    title: "Cardiac Surgery",
    description:
      "Heart Bypass, Valve Replacement, Angioplasty & more",
    price: "Starting from $4,500",
    image: "/images/treatments/cardiac.jpg",
  },
  {
    title: "Cosmetic Surgery",
    description:
      "Rhinoplasty, Facelift, Liposuction & more",
    price: "Starting from $1,800",
    image: "/images/treatments/Cosmetic.jpg",
  },
  {
    title: "Dental Treatment",
    description:
      "Implants, Veneers, Root Canal & more",
    price: "Starting from $200",
    image: "/images/treatments/Dental .jpg",
  },
  {
    title: "Fertility Treatment",
    description:
      "IVF, IUI, Egg Freezing & more",
    price: "Starting from $2,500",
    image: "/images/treatments/Fertility.jpg",
  },
  {
    title: "Orthopedic Surgery",
    description:
      "Knee Replacement, Hip Replacement & more",
    price: "Starting from $3,500",
    image: "/images/treatments/Orthopedic .jpg",
  },
];

export default function PopularTreatments() {
  return (
    <section
      id="treatments"
      className="bg-gradient-to-b from-white via-[#DFC5FE]/5 to-[#DFC5FE]/10 py-16 sm:py-20"
    >
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED] bg-[#DFC5FE]/15 border border-[#DFC5FE]/40 px-4 py-2 rounded-full">
              Explore Healthcare
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
              Popular Treatments
            </h2>

            <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl">
              Explore trusted treatments from experienced specialists and
              leading hospitals across India.
            </p>
          </div>

          {/* View All Treatments */}
          <Link
            href="/treatments"
            className="flex items-center gap-2 text-[#2563A6] font-semibold text-sm hover:text-[#7C3AED] transition-colors whitespace-nowrap"
          >
            View All Treatments
            <span className="text-lg transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

        </div>

        {/* Treatment Cards */}
        <div className="mt-10 flex gap-5 overflow-x-auto pb-5 snap-x snap-mandatory scrollbar-hide">

          {treatments.map((treatment) => (
            <Link
              key={treatment.title}
              href={`/treatments?search=${encodeURIComponent(
                treatment.title
              )}`}
              className="group min-w-[300px] sm:min-w-[340px] lg:min-w-[350px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden snap-start block"
            >

              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-[#DFC5FE]/10">

                <img
                  src={treatment.image}
                  alt={treatment.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />

              </div>

              {/* Content */}
              <div className="p-5">

                <div className="flex items-start justify-between gap-3">

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2563A6] transition-colors">
                    {treatment.title}
                  </h3>

                  <div className="w-8 h-8 shrink-0 rounded-full bg-[#DFC5FE]/15 text-[#7C3AED] flex items-center justify-center group-hover:bg-[#DFC5FE] transition-colors">
                    →
                  </div>

                </div>

                <p className="mt-2 text-sm leading-5 text-gray-500 line-clamp-2">
                  {treatment.description}
                </p>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">

                  <span className="text-sm font-bold text-[#2563A6]">
                    {treatment.price}
                  </span>

                  <span className="text-xs text-gray-400 group-hover:text-[#7C3AED] transition-colors">
                    View details
                  </span>

                </div>

              </div>

            </Link>
          ))}

        </div>

        {/* Scroll Hint */}
        <div className="flex justify-center mt-2 lg:hidden">
          <span className="text-xs text-gray-400">
            ← Swipe to explore more →
          </span>
        </div>

      </div>
    </section>
  );
}