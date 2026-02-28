const traits = [
  "Loyal",
  "Funny",
  "Generous",
  "Always late but worth it",
  "The listener",
  "Fiercely independent",
  "Deeply empathetic",
];

const trivia = [
  "James could name every Nigeria World Cup squad from 1994 onwards. He would test you on it unprompted.",
  "He always slept better in cold weather. His WHOOP data shows his highest recovery scores came in November, consistently, every year.",
  "He believed the secret to good jollof rice was patience and a slightly burnt bottom. He called it \u201Cparty jollof.\u201D He was not wrong.",
  "He sent over 3,400 voice notes in his lifetime. His most common opener: \u201CEhen, so I was thinking...\u201D",
];

const favorites = [
  {
    type: "Movie",
    title: "City of God",
    creator: "Fernando Meirelles",
    year: 2002,
    rating: 5,
  },
  {
    type: "Movie",
    title: "Interstellar",
    creator: "Christopher Nolan",
    year: 2014,
    rating: 5,
  },
  {
    type: "Book",
    title: "Things Fall Apart",
    creator: "Chinua Achebe",
    year: 1958,
    rating: 5,
  },
  {
    type: "Series",
    title: "The Wire",
    creator: "David Simon",
    year: 2002,
    rating: 5,
  },
];

const notableDreams = [
  {
    date: "September 12, 2064",
    title: "The Kitchen in Lagos",
    summary:
      "He dreamed of his mother\u2019s kitchen \u2014 the smell of pepper soup, the sound of the radio, and a door that opened to a garden he\u2019d never seen.",
    mood: "Nostalgic",
  },
  {
    date: "March 1, 2067",
    title: "Flying Over the Niger",
    summary:
      "He flew above the river at sunset, watching the bridges turn to gold. He said he could hear singing from below the water.",
    mood: "Peaceful",
  },
  {
    date: "December 31, 2066",
    title: "Midnight at the Crossroads",
    summary:
      "He stood at a crossroads he recognized from childhood. Each road glowed a different color. He chose the gold one. It led back to his front door.",
    mood: "Lucid",
  },
];

const healthStats = [
  { value: "7.4h", label: "Avg sleep" },
  { value: "78", label: "Avg recovery" },
  { value: "62", label: "Resting HR" },
  { value: "14,200", label: "Avg daily steps" },
];

export default function MemorialPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[70vh] flex items-end overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#0a0a0a_0%,rgba(10,10,10,0.4)_60%,rgba(10,10,10,0.2)_100%),radial-gradient(ellipse_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)]" />

        {/* Photo placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-[320px] h-[320px] rounded-full border border-border bg-gradient-to-br from-surface to-surface-2 flex items-center justify-center text-5xl text-gold/20">
            ◈
          </div>
        </div>

        {/* Info */}
        <div className="relative z-2 px-16 pb-16 w-full">
          <div className="text-[10px] tracking-[4px] text-gold mb-3 uppercase">
            March 4, 1985 — January 17, 2071
          </div>
          <h1 className="font-serif text-[clamp(48px,8vw,96px)] font-light leading-[0.9] mb-4">
            James
            <br />
            Okonkwo
          </h1>
          <div className="font-serif text-[20px] text-muted italic">
            &ldquo;He always showed up. Even when it was hard.&rdquo;
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-16 py-16 max-w-[1100px] mx-auto">
        {/* Anniversary Banner */}
        <div className="bg-gradient-to-br from-surface to-[rgba(201,168,76,0.08)] border border-gold p-8 text-center mb-16">
          <div className="font-serif text-[72px] text-gold leading-none font-light opacity-30">
            10
          </div>
          <div className="font-serif text-[24px] italic -mt-5">
            Ten years since you left. You are still so here.
          </div>
          <div className="text-[10px] tracking-[3px] text-muted uppercase mt-2">
            January 17, 2081 · Death Anniversary
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 mb-16">
          {/* Left column */}
          <div>
            <SectionTitle>Who He Was</SectionTitle>

            <blockquote className="font-serif text-[28px] italic font-light leading-relaxed text-ivory mb-8">
              &ldquo;I&apos;m someone who cries at sunsets, loves arguing about
              football, and makes the best jollof rice in the family. I was
              never the best at goodbyes.&rdquo;
            </blockquote>

            <p className="text-[13px] tracking-[0.5px] text-muted leading-9 mb-4">
              James Emmanuel Okonkwo was born in Lagos, Nigeria on March 4,
              1985. He was fiercely loyal, deeply empathetic, and — according to
              everyone who knew him — always late but always worth it. He had a
              gift for making people feel seen. He&apos;d remember your coffee
              order, your childhood fear, the name of your dog who died. He
              didn&apos;t just listen. He held.
            </p>

            <p className="text-[13px] tracking-[0.5px] text-muted leading-9">
              He loved football with a devotion that bordered on spiritual. He
              cooked jollof rice on every significant occasion. He sent voice
              notes instead of texts because he said &ldquo;you need to hear
              tone.&rdquo; He was right.
            </p>

            <div className="mt-8">
              <SectionTitle>His Traits</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3.5 py-1.5 border border-border text-[9px] tracking-[2px] uppercase text-gold"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <SectionTitle>How He Lived</SectionTitle>

            {/* Health Legacy */}
            <div className="bg-surface border border-border p-8 mb-6">
              <div className="text-[9px] tracking-[5px] text-gold uppercase mb-4 pb-4 border-b border-border">
                Biometric Legacy
              </div>
              <div className="grid grid-cols-2 gap-4">
                {healthStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-5 border border-border"
                  >
                    <span className="block font-serif text-[36px] text-gold">
                      {stat.value}
                    </span>
                    <span className="block text-[8px] tracking-[2px] uppercase text-muted mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted tracking-[1px] leading-7 mt-5">
                James slept best in winter. His recovery scores peaked in
                November. He was most active on Sunday mornings — likely walking
                to church and back, a habit he never lost.
              </p>
            </div>

            {/* Photo Gallery */}
            <SectionTitle>Memories</SectionTitle>
            <div className="grid grid-cols-3 gap-1 mb-16">
              {["◈", "✦", "◻", "⬡", "♡", "◈"].map((icon, i) => (
                <div
                  key={i}
                  className="aspect-square bg-surface-2 border border-border flex items-center justify-center text-muted text-3xl relative overflow-hidden"
                >
                  <span className="text-gold/20">{icon}</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trivia */}
        <SectionTitle>
          Trivia — Things to Know About James
        </SectionTitle>
        {trivia.map((text, i) => (
          <div
            key={i}
            className="bg-surface border border-border border-l-2 border-l-gold px-8 py-6 mb-3"
          >
            <div className="text-[8px] tracking-[3px] text-gold uppercase mb-2">
              Did you know?
            </div>
            <div className="font-serif text-[18px] text-ivory leading-relaxed">
              {text}
            </div>
          </div>
        ))}

        {/* Favorites */}
        <div className="mt-16">
          <SectionTitle>His Favorites — What He Loved</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-16">
            {favorites.map((fav, i) => (
              <div
                key={i}
                className="bg-surface border border-border border-l-2 border-l-gold px-8 py-6"
              >
                <div className="text-[8px] tracking-[3px] text-gold uppercase mb-2">
                  {fav.type}
                </div>
                <div className="font-serif text-[18px] text-ivory leading-relaxed">
                  {fav.title}
                </div>
                <div className="text-[11px] text-muted mt-1">
                  {fav.creator}, {fav.year} &middot;{" "}
                  <span className="text-gold">
                    {"★".repeat(fav.rating)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notable Dreams */}
        <div>
          <SectionTitle>His Dreams — Landscapes of the Sleeping Mind</SectionTitle>
          {notableDreams.map((dream, i) => (
            <div
              key={i}
              className="bg-surface border border-border border-l-2 border-l-gold px-8 py-6 mb-3"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[8px] tracking-[3px] text-gold uppercase">
                  {dream.date}
                </span>
                <span className="px-2.5 py-0.5 border border-border text-[8px] tracking-[2px] uppercase text-muted">
                  {dream.mood}
                </span>
              </div>
              <div className="font-serif text-[18px] text-ivory leading-relaxed mb-1">
                {dream.title}
              </div>
              <div className="text-[12px] text-muted leading-7">
                {dream.summary}
              </div>
            </div>
          ))}
        </div>

        {/* Final Words */}
        <div className="mt-16 pt-12 border-t border-border text-center">
          <p className="text-[10px] tracking-[5px] text-gold uppercase mb-4">
            His Final Words — Written January 2068
          </p>
          <blockquote className="font-serif text-[28px] italic font-light leading-relaxed text-ivory max-w-[600px] mx-auto">
            &ldquo;If you&apos;re reading this, then I&apos;m gone. And I just
            want you to know — I had a good life. A really good one. Thank you
            for being in it.&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] tracking-[5px] text-gold uppercase mb-6 pb-4 border-b border-border">
      {children}
    </div>
  );
}
