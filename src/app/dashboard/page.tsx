import Link from "next/link";

const cards = [
  {
    icon: "✦",
    title: "Personal Profile",
    desc: "Your name, story, and the words you want remembered.",
    status: "Complete",
    statusType: "complete" as const,
    href: "/register",
  },
  {
    icon: "◻",
    title: "Photos",
    desc: "Upload images where you feel most yourself.",
    status: "3 uploaded — add more",
    statusType: "pending" as const,
    href: "/register",
  },
  {
    icon: "◈",
    title: "Traits",
    desc: "The qualities that define you at your core.",
    status: "7 traits selected",
    statusType: "complete" as const,
    href: "/register",
  },
  {
    icon: "♡",
    title: "Biometric Data",
    desc: "WHOOP connected. Apple Health pending.",
    status: "1 device connected",
    statusType: "pending" as const,
    href: "/register",
  },
  {
    icon: "✉",
    title: "Final Message",
    desc: "Your words for the first anniversary.",
    status: "Not written yet",
    statusType: "empty" as const,
    href: "/register",
  },
  {
    icon: "⬡",
    title: "Preview Memorial",
    desc: "See how your memorial page will appear to your loved ones.",
    status: "Preview available",
    statusType: "pending" as const,
    href: "/memorial",
  },
];

const activity = [
  {
    label: "WHOOP sync — today",
    text: "Recovery score: 82 · Sleep: 7h 14m · HRV: 58ms",
  },
  {
    label: "Profile updated — 2 days ago",
    text: "Added 3 new photos and updated your personal statement",
  },
  {
    label: "Trait milestone",
    text: "You've selected 7 traits. Most people stop at 3 — you're thorough.",
  },
];

const statusColors = {
  complete: "text-[#6fcf97]",
  pending: "text-gold",
  empty: "text-muted",
};

export default function DashboardPage() {
  return (
    <div className="pt-30 pb-20 px-12 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="mb-16">
        <p className="text-[10px] tracking-[5px] text-gold uppercase mb-4">
          Your Legacy Dashboard
        </p>
        <h1 className="font-serif text-[56px] font-light leading-none mb-4">
          Welcome,
          <br />
          <em className="italic text-gold">James.</em>
        </h1>
        <p className="text-muted text-[12px] tracking-[1px] leading-8">
          Your legacy is being built. Here&apos;s how complete your profile is.
        </p>
      </div>

      {/* Completeness Bar */}
      <div className="bg-surface border border-border p-8 mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] tracking-[3px] uppercase text-muted">
            Legacy Completeness
          </span>
          <span className="font-serif text-[32px] text-gold">65%</span>
        </div>
        <div className="h-0.5 bg-border relative">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-1000"
            style={{ width: "65%" }}
          />
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group bg-surface border border-border p-8 cursor-pointer transition-all duration-300 hover:border-gold hover:bg-surface-2 hover:-translate-y-0.5 no-underline"
          >
            <span className="text-[28px] mb-4 block">{card.icon}</span>
            <div className="text-[10px] tracking-[3px] uppercase text-gold mb-2">
              {card.title}
            </div>
            <div className="text-[12px] text-muted leading-7">
              {card.desc}
            </div>
            <div
              className={`text-[9px] tracking-[2px] uppercase mt-4 ${statusColors[card.statusType]}`}
            >
              ● {card.status}
            </div>
          </Link>
        ))}
      </div>

      {/* Activity Feed */}
      <div>
        <div className="text-[9px] tracking-[4px] text-gold uppercase mb-8 flex items-center gap-4">
          Recent Activity
          <span className="flex-1 h-px bg-border" />
        </div>

        {activity.map((item, i) => (
          <div
            key={i}
            className="bg-surface border border-border border-l-2 border-l-gold px-8 py-6 mb-3"
          >
            <div className="text-[8px] tracking-[3px] text-gold uppercase mb-2">
              {item.label}
            </div>
            <div className="font-serif text-[18px] text-ivory leading-relaxed">
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
