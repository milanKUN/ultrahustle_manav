import React from "react";

export default function ReviewsAndTeams() {
  const reviews = [
    {
      name: "Emily Chen",
      date: "Nov 15, 2025",
      rating: 5,
      text: "Exceptional designer! Sovan delivered a comprehensive design system that transformed our product. His attention to detail and communication throughout the project was outstanding. Highly recommend for any serious design work!",
    },
    {
      name: "Marcus Johnson",
      date: "Nov 10, 2025",
      rating: 4,
      text: "Great communication and fantastic results. The component library exceeded our expectations and saved us months of development time. Worth every penny!",
    },
    {
      name: "Emily Chen",
      date: "Nov 5, 2025",
      rating: 5,
      text: "Very professional and delivered quality work on time. The mobile app designs were pixel-perfect and the developer handoff was seamless. Would definitely work with again!",
    },
    {
      name: "Marcus Johnson",
      date: "Oct 28, 2025",
      rating: 4,
      text: "Solid work overall. The designs were modern and user-friendly. Minor revisions needed but Sovan was very responsive to feedback.",
    },
    {
      name: "Emily Chen",
      date: "Oct 20, 2025",
      rating: 5,
      text: "Outstanding experience from start to finish. Sovan took the time to understand our business needs and delivered designs that not only looked beautiful but actually improved our conversion rates by 40%!",
    },
  ];

  return (
    <div className=" -mt-14 space-y-20">
      {/* ================= REVIEWS ================= */}
      <section>
        <SectionTitle title="Reviews" />

        <div>
          {reviews.map((r, i) => (
            <div key={i}>
              {/* REVIEW CARD */}
              <div className="bg-white rounded-xl border border-black px-6 py-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <img
                      src="https://i.pravatar.cc/40"
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                    <div>
                      <p className="font-medium text-sm">{r.name}</p>
                      <div className="flex text-yellow-400 text-sm">
                        {"★".repeat(r.rating)}
                        <span className="text-gray-300">
                          {"★".repeat(5 - r.rating)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>

                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {r.text}
                </p>
              </div>

              {/* DIVIDER (not after last item) */}
              {i !== reviews.length - 1 && (
                <div className="my-4 h-px bg-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
           <button className="px-4 py-2 rounded-lg text-sm border border-black">
            Discard
          </button>
          <button className="px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black">
            Save Changes
          </button>
        </div>
      </section>

      {/* ================= TEAMS ================= */}
      {/* ================= TEAMS ================= */}
      <section className="bg-gradient-to-r  rounded-2xl py-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* SECTION TITLE */}
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 whitespace-nowrap">
              Teams
            </h3>
            <div className="flex-1 h-px bg-[#2B2B2B]" />
          </div>

          {/* SCROLLABLE CARDS */}
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="
            min-w-[360px]
            bg-transparent
            backdrop-blur
            rounded-2xl
            p-5
            border-1 border-white
            shadow-sm
            flex-shrink-0
          "
              >
                {/* AVATAR + CONTENT */}
                <div className="flex items-start gap-3">
                  <img
                    src="https://i.pravatar.cc/48"
                    className="w-12 h-12 rounded-full"
                    alt=""
                  />

                  <div className="flex-1">
                    {/* TITLE */}
                    <p className="text-lg font-semibold mb-1">Title</p>
                    <input
                      defaultValue="Title Box"
                      className="
                  w-full
                  border-1 border-black
                  bg-transparent
                  rounded-md
                  px-3 py-1.5
                  text-xs
                  outline-none
                  focus:border-gray-400
                "
                    />

                    {/* DESIGNATION + MEMBERS */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-lg font-semibold mb-1">
                          Designation
                        </p>
                        <input
                          defaultValue="Lead Designer"
                          className="
                      w-full
                      border-1 border-black
                      rounded-md
                      bg-transparent
                      px-3 py-1.5
                      text-xs
                      outline-none
                      focus:border-gray-400
                    "
                        />
                      </div>

                      <div>
                        <p className="text-lg font-semibold mb-1">Members</p>
                        <div
                          className="
                      flex items-center gap-2
                      border-1 border-black
                      rounded-md
                      bg-transparent
                      px-3 py-1.5
                      text-xs
                      text-gray-600
                      bg-white
                    "
                        >
                          👥 12 members
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 mt-6">
           <button className="px-4 py-2 rounded-lg text-sm border border-black">
            Discard
          </button>
          <button className="px-4 py-2 bg-[#CEFF1B] rounded-lg text-sm font-medium border border-black">
            Save Changes
          </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================= REUSABLE TITLE ================= */
function SectionTitle({ title }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <div className="flex-1 h-px bg-[#2B2B2B]" />
    </div>
  );
}
