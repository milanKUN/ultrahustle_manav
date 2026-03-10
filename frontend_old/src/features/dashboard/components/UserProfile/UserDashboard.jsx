import { CheckCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePageDesktop() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F4F6F2] flex justify-center py-10">
      <div className="w-[1440px] space-y-6">
        {/* ================= TOP PROFILE BAR ================= */}
        <div className="bg-gradient-to-r border-4 border-white from-[#F2F6EA] to-white rounded-2xl px-8 py-6 flex justify-between items-center ">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#2E2E2E]" />

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Abigail</h2>
                <CheckCircle className="w-5 h-5 text-lime-500" />
              </div>
              <p className="text-sm text-gray-500">@Abigail_12</p>
              <p className="text-xs text-green-600 mt-1">● Online</p>
              <p className="text-xs text-gray-500 mt-1">
                1,234 Friends · Joined Oct 2025
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-2 rounded-lg border text-sm">
              Message
            </button>
            <button className="px-5 py-2 rounded-lg bg-lime-300 text-sm font-medium">
              Add Friend
            </button>
          </div>
        </div>

        {/* ================= INFO CARDS ================= */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <h4 className="font-semibold mb-2">
              Product Designer & Full-Stack Developer
            </h4>
            <p className="text-sm text-gray-600">
              Award-winning designer with 8+ years creating elegant,
              user-centered digital experiences. Specialized in design systems,
              mobile apps, and SaaS platforms.
            </p>
          </Card>

          <Card>
            <p className="text-sm mb-2">
              📍 <strong>Location:</strong> Kolkata, India
            </p>
            <span className="inline-block bg-lime-200 text-xs px-3 py-1 rounded-full">
              Available for collaboration
            </span>
          </Card>

          <Card>
            <div className="flex gap-2 mb-3">
              <Badge>Trusted Seller</Badge>
              <Badge>Fast Responder</Badge>
              <Badge>Quality Work</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Tag>#UI/UX</Tag>
              <Tag>#Web Design</Tag>
              <Tag>#React</Tag>
              <Tag>#Figma</Tag>
              <Tag>#Mobile</Tag>
            </div>
          </Card>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-4 gap-6">
          <Stat icon="📦" value="1200" label="Listings" />
          <Stat icon="✅" value="47" label="Projects Completed" />
          <Stat
            icon={<Star className="w-5 h-5 text-lime-500" />}
            value="4.3"
            label="Average Rating"
          />
          <Stat icon="🟢🟢🟢🟢" value="30" label="Activity Time" />
        </div>

        {/* ================= ABOUT ================= */}
        <Card>
          <h4 className="font-semibold mb-2">About</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            I’m a passionate product designer and full-stack developer with over
            8 years of experience creating elegant, user-centered digital
            experiences. I’ve helped startups scale from 0 to 1M users.
          </p>
        </Card>

        {/* ================= SKILLS ================= */}
        <div className="bg-transparent rounded-2xl p-6">
          <h4 className="font-semibold mb-3">Skills & Expertise</h4>
          <div className="flex flex-wrap gap-2">
            <Skill>Agile/Scrum</Skill>
            <Skill>Accessibility</Skill>
            <Skill>Visual Design</Skill>
            <Skill>Front-end Development</Skill>
            <Skill>Product Design</Skill>
            <Skill>UI/UX Design</Skill>
            <Skill>Design Systems</Skill>
            <Skill>Mobile App Design</Skill>
          </div>
        </div>

        {/* ================= TOOLS ================= */}
        <div className="bg-transparent rounded-2xl p-6">
          <h4 className="font-semibold mb-3">Tools & Technologies</h4>
          <div className="flex flex-wrap gap-2">
            <GrayTag>Notion</GrayTag>
            <GrayTag>Tailwind CSS</GrayTag>
            <GrayTag>Photoshop</GrayTag>
            <GrayTag>Figma</GrayTag>
            <GrayTag>Illustrator</GrayTag>
            <GrayTag>TypeScript</GrayTag>
            <GrayTag>Webflow</GrayTag>
          </div>
        </div>

        {/* ================= LANGUAGES ================= */}
        <div className="bg-transparent rounded-2xl p-6">
          <h4 className="font-semibold mb-3">Languages</h4>
          <div className="flex gap-4 text-sm">
            <span>
              English <GrayTag>Native</GrayTag>
            </span>
            <span>
              Hindi <GrayTag>Native</GrayTag>
            </span>
            <span>
              Tamil <GrayTag>Fluent</GrayTag>
            </span>
          </div>
        </div>

        {/* ================= MY PORTFOLIO ================= */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-600">My Portfolio</h3>

          <div className="bg-gradient-to-r from-[#F2F6EA] to-white rounded-2xl border p-6 flex gap-6">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKuGReWOpOI3I1q_vlS6uhPy7lo-EwwZ9O0A&s"
              alt="SalonSync"
              className="w-[420px] h-[260px] object-cover rounded-xl"
            />

            <div className="flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-lg mb-2">
                  SalonSync – AI-Powered Salon App UI/UX
                </h4>
                <p className="text-sm text-gray-600 max-w-xl">
                  Designing a next-gen salon app with AI recommendations,
                  seamless booking, and elegant UI.
                </p>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Project cost{" "}
                <span className="font-medium text-gray-700">$600–$800</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <PortfolioCard
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKuGReWOpOI3I1q_vlS6uhPy7lo-EwwZ9O0A&s"
              title="E-commerce Dashboard Redesign"
              cost="$600–$800"
            />
            <PortfolioCard
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKuGReWOpOI3I1q_vlS6uhPy7lo-EwwZ9O0A&s"
              title="Analytics Platform UI"
              cost="$600–$800"
            />
            <PortfolioCard
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKuGReWOpOI3I1q_vlS6uhPy7lo-EwwZ9O0A&sg"
              title="Mobile App UI Design"
              cost="$600–$800"
            />
          </div>
        </div>
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-lime-300 text-sm font-medium">
              Listings
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-100 text-sm">
              Projects & Purchases
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {["All", "Services", "Products", "Courses", "Webinars"].map(
              (item) => (
                <span
                  key={item}
                  className="px-4 py-1.5 rounded-full border text-sm cursor-pointer hover:bg-gray-50"
                >
                  {item}
                </span>
              )
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-6">
            {listings.map((item, index) => (
              <ListingCard key={index} {...item} />
            ))}
          </div>
        </div>
        {/* ================= REVIEWS ================= */}
        <div className="bg-gradient-to-r from-[#F2F6EA] to-white rounded-2xl border p-8">
          <h3 className="text-lg font-semibold mb-6">Reviews</h3>

          <div className="grid grid-cols-2 gap-10">

            {/* ===== LEFT : RATING SUMMARY ===== */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold">4.9</span>
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
                <span className="text-sm text-gray-500">(48 reviews)</span>
              </div>

              {[5, 4, 3, 2, 1].map((star, i) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-4 text-sm">{star}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width:
                          star === 5
                            ? "80%"
                            : star === 4
                              ? "35%"
                              : star === 3
                                ? "15%"
                                : star === 2
                                  ? "5%"
                                  : "2%",
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-6 text-right">
                    {star === 5
                      ? 38
                      : star === 4
                        ? 7
                        : star === 3
                          ? 2
                          : star === 2
                            ? 1
                            : 0}
                  </span>
                </div>
              ))}
            </div>

            {/* ===== RIGHT : REVIEWS LIST (SCROLLABLE) ===== */}
            <div className="h-[420px] overflow-y-auto pr-4 space-y-6">

              <ReviewItem
                name="Emily Chen"
                date="Nov 15, 2025"
                rating={5}
                text="Exceptional designer! Sovan delivered a comprehensive design system that transformed our product. His attention to detail and communication throughout the project was outstanding."
              />

              <ReviewItem
                name="Marcus Johnson"
                date="Nov 10, 2025"
                rating={5}
                text="Great communication and fantastic results. The component library exceeded our expectations and saved us months of development time."
              />

              <ReviewItem
                name="Marcus Johnson"
                date="Nov 5, 2025"
                rating={4}
                text="Very professional and delivered quality work on time. The mobile app designs were pixel-perfect and the developer handoff was seamless."
              />

              <ReviewItem
                name="David Kim"
                date="Oct 28, 2025"
                rating={4}
                text="Solid work overall. The designs were modern and user-friendly. Minor revisions were needed but Sovan was very responsive to feedback."
              />

              <ReviewItem
                name="Sarah Williams"
                date="Oct 20, 2025"
                rating={5}
                text="Outstanding experience from start to finish. Sovan took the time to understand our business needs and delivered designs that improved our conversion rates by 40%!"
              />

            </div>
          </div>
        </div>

        {/* ================= TEAMS ================= */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Teams</h3>

          <div className="grid grid-cols-3 gap-6">
            <TeamCard
              name="Design Systems Collective"
              role="Lead Designer"
              members="12 members"
            />

            <TeamCard
              name="AI Product Innovators"
              role="UI/UX Designer"
              members="12 members"
            />

            <TeamCard
              name="Mobile First Studios"
              role="Senior Designer"
              members="12 members"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Card = ({ children }) => (
  <div className="bg-gradient-to-r border-4 border-white from-[#F2F6EA] to-white rounded-2xl p-6">{children}</div>
);

const Badge = ({ children }) => (
  <span className="bg-lime-200 text-xs px-3 py-1 rounded-full font-medium">
    {children}
  </span>
);

const Tag = ({ children }) => (
  <span className="border rounded-full px-3 py-1 text-xs">{children}</span>
);

const Skill = ({ children }) => (
  <span className="bg-lime-300 text-xs px-3 py-1 rounded-full">{children}</span>
);

const GrayTag = ({ children }) => (
  <span className="border px-3 py-1 rounded-full text-xs ml-1">{children}</span>
);

const Stat = ({ icon, value, label }) => (
  <div className="bg-gradient-to-r border-4 border-white from-[#F2F6EA] to-white rounded-2xl p-6 flex items-center gap-4">
    <div className="w-10 h-10 bg-lime-200 rounded-lg flex items-center justify-center text-lg">
      {icon}
    </div>
    <div>
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);

const PortfolioCard = ({ image, title, cost }) => (
  <div className="bg-gradient-to-r border-4 border-white from-[#F2F6EA] to-white rounded-2xl p-4 space-y-3">
    <img
      src={image}
      alt={title}
      className="w-full h-[160px] object-cover rounded-xl"
    />
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-500">
        Project cost <span className="text-gray-700">{cost}</span>
      </p>
    </div>
  </div>
);
const ListingCard = ({ image, title, tag, price, views }) => (
  <div className="bg-gradient-to-r border-4 border-white from-[#F2F6EA] to-white rounded-2xl overflow-hidden">
    <div className="relative">
      <img src={image} alt={title} className="w-full h-[180px] object-cover" />
      <span className="absolute bottom-3 right-3 bg-lime-300 text-xs px-3 py-1 rounded-full font-medium">
        {tag}
      </span>
    </div>

    <div className="p-4 space-y-3">
      <p className="text-sm font-medium">{title}</p>
      <div className="flex justify-between text-xs text-gray-500">
        <span>👁 {views} views</span>
        <span className="font-medium text-gray-700">${price}</span>
      </div>
      <button className="w-full border rounded-lg py-2 text-sm hover:bg-gray-50">
        View Listing
      </button>
    </div>
  </div>
);

/* ================= DATA ================= */

const listings = [
  {
    image: "/1.png",
    title: "Complete UI/UX Design for Mobile & Web",
    tag: "Service",
    price: "2,500",
    views: 3247,
  },
  {
    image: "/1.png",
    title: "Figma Component Library – Pro Kit",
    tag: "Products",
    price: "2,500",
    views: 3247,
  },
  {
    image: "/1.png",
    title: "Advanced UI/UX Webinar",
    tag: "Webinars",
    price: "2,500",
    views: 3247,
  },
  {
    image: "/1.png",
    title: "Design System Setup & Consulting",
    tag: "Service",
    price: "2,500",
    views: 3247,
  },
  {
    image: "/1.png",
    title: "Dashboard Templates Course",
    tag: "Courses",
    price: "2,500",
    views: 3247,
  },
  {
    image: "/1.png",
    title: "Mobile App UI Design Package",
    tag: "Service",
    price: "2,500",
    views: 3247,
  },
];
const ReviewItem = ({ name, date, rating, text }) => (
  <div className="flex gap-4 border-b pb-4">
    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />

    <div className="flex-1">
      <div className="flex justify-between items-center">
        <p className="font-medium text-sm">{name}</p>
        <span className="text-xs text-gray-500">{date}</span>
      </div>

      <div className="text-yellow-400 text-sm">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </div>

      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{text}</p>
    </div>
  </div>
);

const TeamCard = ({ name, role, members }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-[0_2px_16px_0_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-300" />
        <div className="flex flex-col gap-1">
          <span className="font-medium text-base">{name}</span>
          <span className="border px-3 py-1 rounded-full text-xs text-gray-700 bg-white">{role}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <span className="flex items-center gap-1">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          {members}
          <span>members</span>
        </span>
      </div>
      <button onClick={() => navigate('/public-team-profile')} className="w-60 flex items-center justify-center gap-2 border rounded-lg py-2 text-sm font-medium bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.04)]">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 12h8M8 12l3-3m-3 3l3 3" /><rect x="3" y="3" width="18" height="18" rx="4" /></svg>
        View Team
      </button>
    </div>
  );
};
