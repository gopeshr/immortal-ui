"use client";

import { useState } from "react";

/* ---- Types ---- */

type MediaType = "movie" | "book" | "series";

type MediaStatus =
  | "watched"
  | "watching"
  | "want_to_watch"
  | "read"
  | "reading"
  | "want_to_read";

interface LibraryItem {
  id: string;
  type: MediaType;
  title: string;
  creator: string;
  year: number;
  rating: number | null;
  review: string | null;
  status: MediaStatus;
  coverIcon: string;
  favorite: boolean;
}

/* ---- Demo Data ---- */

const DEMO_ITEMS: LibraryItem[] = [
  {
    id: "1",
    type: "movie",
    title: "City of God",
    creator: "Fernando Meirelles",
    year: 2002,
    rating: 5,
    review:
      "This film rewired something in me. The way it moves between beauty and brutality — I\u2019ve never seen anything like it.",
    status: "watched",
    coverIcon: "\u25C8",
    favorite: true,
  },
  {
    id: "2",
    type: "movie",
    title: "Interstellar",
    creator: "Christopher Nolan",
    year: 2014,
    rating: 5,
    review:
      "The docking scene still makes me hold my breath. Every single time.",
    status: "watched",
    coverIcon: "\u2726",
    favorite: true,
  },
  {
    id: "3",
    type: "movie",
    title: "Black Panther",
    creator: "Ryan Coogler",
    year: 2018,
    rating: 4,
    review: "Wakanda forever. That\u2019s all I need to say.",
    status: "watched",
    coverIcon: "\u2B21",
    favorite: false,
  },
  {
    id: "4",
    type: "movie",
    title: "Amores Perros",
    creator: "Alejandro G. I\u00F1\u00E1rritu",
    year: 2000,
    rating: 4,
    review: null,
    status: "watched",
    coverIcon: "\u25FB",
    favorite: false,
  },
  {
    id: "5",
    type: "movie",
    title: "Parasite",
    creator: "Bong Joon-ho",
    year: 2019,
    rating: null,
    review: null,
    status: "want_to_watch",
    coverIcon: "\u2661",
    favorite: false,
  },
  {
    id: "6",
    type: "book",
    title: "Things Fall Apart",
    creator: "Chinua Achebe",
    year: 1958,
    rating: 5,
    review:
      "Every Nigerian should read this. Every human should read this. Achebe showed us ourselves.",
    status: "read",
    coverIcon: "\u2726",
    favorite: true,
  },
  {
    id: "7",
    type: "book",
    title: "Long Walk to Freedom",
    creator: "Nelson Mandela",
    year: 1994,
    rating: 5,
    review:
      "27 years. The patience, the dignity. This book taught me what endurance really looks like.",
    status: "read",
    coverIcon: "\u25C8",
    favorite: false,
  },
  {
    id: "8",
    type: "book",
    title: "The Alchemist",
    creator: "Paulo Coelho",
    year: 1988,
    rating: 4,
    review: null,
    status: "read",
    coverIcon: "\u2B21",
    favorite: false,
  },
  {
    id: "9",
    type: "book",
    title: "Sapiens",
    creator: "Yuval Noah Harari",
    year: 2011,
    rating: 4,
    review: "Makes you feel very small and very large at the same time.",
    status: "reading",
    coverIcon: "\u25FB",
    favorite: false,
  },
  {
    id: "10",
    type: "series",
    title: "The Wire",
    creator: "David Simon",
    year: 2002,
    rating: 5,
    review:
      "The greatest television ever made. Omar coming. That\u2019s the tweet.",
    status: "watched",
    coverIcon: "\u25C8",
    favorite: true,
  },
  {
    id: "11",
    type: "series",
    title: "Breaking Bad",
    creator: "Vince Gilligan",
    year: 2008,
    rating: 5,
    review: "Walter White made me question everything I thought about morality.",
    status: "watched",
    coverIcon: "\u2726",
    favorite: false,
  },
  {
    id: "12",
    type: "series",
    title: "Squid Game",
    creator: "Hwang Dong-hyuk",
    year: 2021,
    rating: 3,
    review: null,
    status: "watching",
    coverIcon: "\u2B21",
    favorite: false,
  },
];

const TABS: { key: MediaType; label: string }[] = [
  { key: "movie", label: "Movies" },
  { key: "book", label: "Books" },
  { key: "series", label: "Series" },
];

const STATUS_LABELS: Record<MediaStatus, string> = {
  watched: "Watched",
  watching: "Watching",
  want_to_watch: "Want to Watch",
  read: "Read",
  reading: "Reading",
  want_to_read: "Want to Read",
};

function statusOptionsForType(type: MediaType): MediaStatus[] {
  if (type === "book")
    return ["read", "reading", "want_to_read"];
  return ["watched", "watching", "want_to_watch"];
}

/* ---- Component ---- */

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>(DEMO_ITEMS);
  const [activeTab, setActiveTab] = useState<MediaType>("movie");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [reviewDraft, setReviewDraft] = useState("");

  // Add form
  const [newTitle, setNewTitle] = useState("");
  const [newCreator, setNewCreator] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newStatus, setNewStatus] = useState<MediaStatus>("want_to_watch");

  const filtered = items.filter(
    (item) =>
      item.type === activeTab &&
      (statusFilter === "all" || item.status === statusFilter)
  );

  const totalItems = items.length;
  const ratedItems = items.filter((i) => i.rating !== null);
  const avgRating =
    ratedItems.length > 0
      ? (ratedItems.reduce((sum, i) => sum + (i.rating || 0), 0) / ratedItems.length).toFixed(1)
      : "—";
  const favCount = items.filter((i) => i.favorite).length;

  function addItem() {
    if (!newTitle.trim()) return;
    const item: LibraryItem = {
      id: Date.now().toString(),
      type: activeTab,
      title: newTitle.trim(),
      creator: newCreator.trim(),
      year: parseInt(newYear) || new Date().getFullYear(),
      rating: null,
      review: null,
      status: newStatus,
      coverIcon: ["\u25C8", "\u2726", "\u2B21", "\u25FB", "\u2661"][
        Math.floor(Math.random() * 5)
      ],
      favorite: false,
    };
    setItems((prev) => [item, ...prev]);
    setNewTitle("");
    setNewCreator("");
    setNewYear("");
    setNewStatus(activeTab === "book" ? "want_to_read" : "want_to_watch");
    setShowAddForm(false);
  }

  function setRating(id: string, rating: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, rating: item.rating === rating ? null : rating }
          : item
      )
    );
  }

  function toggleFavorite(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  }

  function saveReview(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, review: reviewDraft.trim() || null }
          : item
      )
    );
    setEditingReview(null);
    setReviewDraft("");
  }

  function startEditReview(item: LibraryItem) {
    setEditingReview(item.id);
    setReviewDraft(item.review || "");
  }

  // Update default status when tab changes
  function switchTab(tab: MediaType) {
    setActiveTab(tab);
    setStatusFilter("all");
    setNewStatus(tab === "book" ? "want_to_read" : "want_to_watch");
    setShowAddForm(false);
  }

  const filterOptions = [
    { key: "all", label: "All" },
    ...statusOptionsForType(activeTab).map((s) => ({
      key: s,
      label: STATUS_LABELS[s],
    })),
  ];

  return (
    <div className="pt-30 pb-20 px-12 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="mb-16">
        <p className="text-[10px] tracking-[5px] text-gold uppercase mb-4">
          Your Library
        </p>
        <h1 className="font-serif text-[56px] font-light leading-none mb-4">
          What James
          <br />
          <em className="italic text-gold">Consumed</em>
        </h1>
        <p className="text-muted text-[12px] tracking-[1px] leading-8">
          The movies, books, and series that shaped your world.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="bg-surface border border-border p-8 mb-8 flex justify-between items-center">
        <div className="text-center">
          <span className="block font-serif text-[32px] text-gold">
            {totalItems}
          </span>
          <span className="text-[9px] tracking-[3px] uppercase text-muted">
            Total Items
          </span>
        </div>
        <div className="text-center">
          <span className="block font-serif text-[32px] text-gold">
            {avgRating}
          </span>
          <span className="text-[9px] tracking-[3px] uppercase text-muted">
            Avg Rating
          </span>
        </div>
        <div className="text-center">
          <span className="block font-serif text-[32px] text-gold">
            {favCount}
          </span>
          <span className="text-[9px] tracking-[3px] uppercase text-muted">
            Favorites
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={`px-5 py-2.5 border text-[10px] tracking-[2px] uppercase cursor-pointer transition-all duration-200 ${
              activeTab === tab.key
                ? "border-gold text-gold bg-gold-dim"
                : "border-border text-muted hover:border-gold hover:text-gold"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters + Add */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setStatusFilter(opt.key)}
              className={`px-3 py-1.5 border text-[9px] tracking-[2px] uppercase cursor-pointer transition-all duration-200 ${
                statusFilter === opt.key
                  ? "border-gold text-gold bg-gold-dim"
                  : "border-border text-muted hover:border-gold hover:text-gold"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="border border-gold text-gold px-5 py-2 text-[10px] tracking-[2px] uppercase cursor-pointer transition-all duration-200 hover:bg-gold-dim shrink-0"
        >
          {showAddForm ? "Cancel" : "+ Add Item"}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-surface border border-border p-8 mb-8 animate-fade-in">
          <SectionLabel>
            Add {activeTab === "movie" ? "Movie" : activeTab === "book" ? "Book" : "Series"}
          </SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormGroup label="Title">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={
                  activeTab === "movie"
                    ? "e.g. The Shawshank Redemption"
                    : activeTab === "book"
                    ? "e.g. 1984"
                    : "e.g. True Detective"
                }
              />
            </FormGroup>
            <FormGroup
              label={
                activeTab === "book"
                  ? "Author"
                  : activeTab === "movie"
                  ? "Director"
                  : "Creator"
              }
            >
              <input
                type="text"
                value={newCreator}
                onChange={(e) => setNewCreator(e.target.value)}
                placeholder="Name"
              />
            </FormGroup>
            <FormGroup label="Year">
              <input
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="2024"
              />
            </FormGroup>
            <FormGroup label="Status">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as MediaStatus)}
              >
                {statusOptionsForType(activeTab).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </FormGroup>
          </div>
          <button
            onClick={addItem}
            className="mt-6 bg-gold text-black px-8 py-3 text-[10px] tracking-[4px] uppercase font-normal transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]"
          >
            Add to Library
          </button>
        </div>
      )}

      {/* Item Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted text-[12px] tracking-[2px]">
          Nothing here yet. Add your first{" "}
          {activeTab === "movie" ? "movie" : activeTab === "book" ? "book" : "series"}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-surface border border-border p-6 transition-all duration-300 hover:border-gold hover:-translate-y-0.5 group"
            >
              {/* Icon + Favorite */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 border border-border flex items-center justify-center text-2xl text-gold/30">
                  {item.coverIcon}
                </div>
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`text-lg transition-colors cursor-pointer ${
                    item.favorite ? "text-gold" : "text-border hover:text-gold"
                  }`}
                  title={item.favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {item.favorite ? "\u2665" : "\u2661"}
                </button>
              </div>

              {/* Title + Creator */}
              <div className="font-serif text-[18px] text-ivory leading-snug mb-1">
                {item.title}
              </div>
              <div className="text-[11px] text-muted tracking-[1px] mb-3">
                {item.creator}, {item.year}
              </div>

              {/* Star Rating */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(item.id, star)}
                    className={`text-base cursor-pointer transition-colors px-0.5 ${
                      item.rating && star <= item.rating
                        ? "text-gold"
                        : "text-border hover:text-gold/50"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* Status Badge */}
              <span className="inline-block px-2.5 py-1 border border-border text-[8px] tracking-[2px] uppercase text-muted mb-3">
                {STATUS_LABELS[item.status]}
              </span>

              {/* Review */}
              {editingReview === item.id ? (
                <div className="mt-3">
                  <textarea
                    value={reviewDraft}
                    onChange={(e) => setReviewDraft(e.target.value)}
                    placeholder="Write your thoughts..."
                    className="text-[12px] min-h-[80px]"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => saveReview(item.id)}
                      className="bg-gold text-black px-4 py-1.5 text-[9px] tracking-[2px] uppercase cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingReview(null);
                        setReviewDraft("");
                      }}
                      className="border border-border text-muted px-4 py-1.5 text-[9px] tracking-[2px] uppercase cursor-pointer hover:text-ivory"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : item.review ? (
                <div className="mt-3">
                  <p className="text-[11px] text-muted/80 leading-6 italic">
                    &ldquo;{item.review}&rdquo;
                  </p>
                  <button
                    onClick={() => startEditReview(item)}
                    className="text-[9px] tracking-[2px] text-gold uppercase mt-2 cursor-pointer hover:text-gold-light"
                  >
                    Edit Review
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditReview(item)}
                  className="mt-3 text-[9px] tracking-[2px] text-gold/60 uppercase cursor-pointer hover:text-gold"
                >
                  + Write Review
                </button>
              )}
            </div>
          ))}
        </div>
      )}
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
