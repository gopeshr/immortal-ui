"use client";

import { useState } from "react";

/* ---- Types ---- */

type DreamMood =
  | "peaceful"
  | "vivid"
  | "strange"
  | "nightmare"
  | "lucid"
  | "nostalgic"
  | "prophetic";

interface DreamEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: DreamMood | null;
  notable: boolean;
}

const MOOD_OPTIONS: DreamMood[] = [
  "peaceful",
  "vivid",
  "strange",
  "nightmare",
  "lucid",
  "nostalgic",
  "prophetic",
];

/* ---- Demo Data ---- */

const DEMO_DREAMS: DreamEntry[] = [
  {
    id: "1",
    date: "2068-01-03",
    title: "The Voice Notes from the Future",
    content:
      "I was sitting in my living room when my phone buzzed. A voice note — from me. But older. Much older. The voice said: \u201CDon\u2019t forget to call her back.\u201D I didn\u2019t know who \u201Cher\u201D was. I woke up and called my mother.",
    mood: "strange",
    notable: true,
  },
  {
    id: "2",
    date: "2067-11-18",
    title: "The Kitchen in Lagos",
    content:
      "Mama\u2019s kitchen. The pepper soup was on the stove, radio playing Fela. Everything was golden, the light, the walls, even the steam. I reached for a spoon and my hand went through it. She looked at me and smiled like she knew. I sat down and just listened to the radio with her.",
    mood: "nostalgic",
    notable: true,
  },
  {
    id: "3",
    date: "2067-09-02",
    title: "Flying Over the Niger",
    content:
      "I was above the river at sunset. No wings, no plane — just moving. The bridges below me turned to gold. I could hear singing coming from under the water, hundreds of voices, like a choir buried in the current. I wanted to dive in but I kept rising.",
    mood: "peaceful",
    notable: true,
  },
  {
    id: "4",
    date: "2067-06-14",
    title: "The Football Match That Never Ended",
    content:
      "Nigeria vs. Brazil, but the pitch was in the clouds. Every time someone scored, the goalposts moved further apart. Okocha was playing. He looked 25. I was on the bench, not as a player, but as a child watching. The match went on for what felt like years. Nobody won. Nobody wanted it to end.",
    mood: "vivid",
    notable: false,
  },
  {
    id: "5",
    date: "2067-03-22",
    title: "The Library of Unread Books",
    content:
      "A building made entirely of books I\u2019d never read. Thousands of them. Each one had my name on the spine. I opened one and the pages were blank except for one line: \u201CYou would have loved this.\u201D I woke up and ordered three books.",
    mood: "strange",
    notable: false,
  },
  {
    id: "6",
    date: "2066-12-31",
    title: "Midnight at the Crossroads",
    content:
      "New Year\u2019s Eve, but the streets were empty. I stood at a crossroads I recognized from childhood — the one near the market in Surulere. Each road glowed a different color. I chose the gold one. It led back to my front door.",
    mood: "lucid",
    notable: true,
  },
  {
    id: "7",
    date: "2066-08-05",
    title: "The Jollof That Cooked Itself",
    content:
      "I walked into the kitchen and the jollof was making itself. The tomatoes were jumping into the pot, the rice was pouring itself, the fire was singing. My grandmother was sitting in the corner, laughing. She said: \u201CIt always knew how. You just had to stop watching.\u201D",
    mood: "peaceful",
    notable: false,
  },
];

/* ---- Component ---- */

export default function DreamsPage() {
  const [dreams, setDreams] = useState<DreamEntry[]>(DEMO_DREAMS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newMood, setNewMood] = useState<DreamMood | null>(null);
  const [newDate, setNewDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const totalDreams = dreams.length;
  const notableCount = dreams.filter((d) => d.notable).length;
  const moodCounts: Record<string, number> = {};
  dreams.forEach((d) => {
    if (d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
  });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  function addDream() {
    if (!newTitle.trim() || !newContent.trim()) return;
    const dream: DreamEntry = {
      id: Date.now().toString(),
      date: newDate,
      title: newTitle.trim(),
      content: newContent.trim(),
      mood: newMood,
      notable: false,
    };
    setDreams((prev) => [dream, ...prev]);
    setNewTitle("");
    setNewContent("");
    setNewMood(null);
    setNewDate(new Date().toISOString().split("T")[0]);
    setShowAddForm(false);
  }

  function toggleNotable(id: string) {
    setDreams((prev) =>
      prev.map((d) => (d.id === id ? { ...d, notable: !d.notable } : d))
    );
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="pt-30 pb-20 px-12 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="mb-16">
        <p className="text-[10px] tracking-[5px] text-gold uppercase mb-4">
          Dream Archive
        </p>
        <h1 className="font-serif text-[56px] font-light leading-none mb-4">
          What James
          <br />
          <em className="italic text-gold">Dreamed</em>
        </h1>
        <p className="text-muted text-[12px] tracking-[1px] leading-8">
          The landscapes of your sleeping mind, preserved.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="bg-surface border border-border p-8 mb-8 flex justify-between items-center">
        <div className="text-center">
          <span className="block font-serif text-[32px] text-gold">
            {totalDreams}
          </span>
          <span className="text-[9px] tracking-[3px] uppercase text-muted">
            Dreams Logged
          </span>
        </div>
        <div className="text-center">
          <span className="block font-serif text-[32px] text-gold capitalize">
            {topMood ? topMood[0] : "\u2014"}
          </span>
          <span className="text-[9px] tracking-[3px] uppercase text-muted">
            Most Common Mood
          </span>
        </div>
        <div className="text-center">
          <span className="block font-serif text-[32px] text-gold">
            {notableCount}
          </span>
          <span className="text-[9px] tracking-[3px] uppercase text-muted">
            Notable Dreams
          </span>
        </div>
      </div>

      {/* Add Dream */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="border border-gold text-gold px-6 py-2.5 text-[10px] tracking-[2px] uppercase cursor-pointer transition-all duration-200 hover:bg-gold-dim"
        >
          {showAddForm ? "Cancel" : "+ Record a Dream"}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-surface border border-border p-8 mb-8 animate-fade-in">
          <SectionLabel>New Dream Entry</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormGroup label="Date">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </FormGroup>
            <FormGroup label="Title">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Give this dream a name..."
              />
            </FormGroup>
          </div>

          <FormGroup label="What happened?">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Describe the dream as vividly as you remember..."
              className="min-h-[120px]"
            />
          </FormGroup>

          <div className="mt-6">
            <label className="text-[9px] tracking-[3px] uppercase text-muted block mb-3">
              Mood / Vibe
            </label>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setNewMood(newMood === mood ? null : mood)}
                  className={`px-4 py-2 border text-[10px] tracking-[2px] uppercase cursor-pointer transition-all duration-200 capitalize ${
                    newMood === mood
                      ? "border-gold text-gold bg-gold-dim"
                      : "border-border text-muted hover:border-gold hover:text-gold"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={addDream}
            className="mt-6 bg-gold text-black px-8 py-3 text-[10px] tracking-[4px] uppercase font-normal transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]"
          >
            Save Dream
          </button>
        </div>
      )}

      {/* Dream List */}
      <div>
        <SectionLabel>Dream Journal</SectionLabel>
        {dreams.map((dream) => (
          <div
            key={dream.id}
            className="bg-surface border border-border border-l-2 border-l-gold px-8 py-6 mb-3 relative group"
          >
            {/* Notable toggle */}
            <button
              onClick={() => toggleNotable(dream.id)}
              className={`absolute top-6 right-6 text-lg cursor-pointer transition-colors ${
                dream.notable ? "text-gold" : "text-border hover:text-gold/50"
              }`}
              title={
                dream.notable ? "Remove from notable" : "Mark as notable"
              }
            >
              {dream.notable ? "\u25C8" : "\u25C7"}
            </button>

            {/* Date + Mood */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[8px] tracking-[3px] text-gold uppercase">
                {formatDate(dream.date)}
              </span>
              {dream.mood && (
                <span className="px-2.5 py-0.5 border border-border text-[8px] tracking-[2px] uppercase text-muted capitalize">
                  {dream.mood}
                </span>
              )}
            </div>

            {/* Title */}
            <div className="font-serif text-[22px] text-ivory mb-2 pr-8">
              {dream.title}
            </div>

            {/* Content */}
            <div className="text-[12px] text-muted leading-8">
              {dream.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] tracking-[4px] text-gold uppercase mb-8 flex items-center gap-4">
      {children}
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

function FormGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] tracking-[3px] uppercase text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
