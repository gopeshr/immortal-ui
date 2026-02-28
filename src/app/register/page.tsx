"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const DEFAULT_TRAITS = [
  "Loyal",
  "Funny",
  "Stubborn",
  "Generous",
  "Creative",
  "Protective",
  "Adventurous",
  "Overthinks everything",
  "Early riser",
  "Night owl",
  "Always late but worth it",
  "The fixer",
  "The listener",
  "The dreamer",
  "Fiercely independent",
  "Deeply empathetic",
];

const HEALTH_DEVICES = [
  { id: "whoop", icon: "\u231A", label: "WHOOP", connectedLabel: "WHOOP Connected" },
  { id: "apple", icon: "\uD83C\uDF4E", label: "Apple Health", connectedLabel: "Apple Health Connected" },
  { id: "garmin", icon: "\uD83C\uDFC3", label: "Garmin", connectedLabel: "Garmin Connected" },
  { id: "fitbit", icon: "\uD83D\uDC9A", label: "Fitbit", connectedLabel: "Fitbit Connected" },
];

export default function RegisterPage() {
  const [selectedTraits, setSelectedTraits] = useState<Set<string>>(new Set());
  const [customTraits, setCustomTraits] = useState<string[]>([]);
  const [customTraitInput, setCustomTraitInput] = useState("");
  const [connectedDevices, setConnectedDevices] = useState<Set<string>>(new Set(["whoop"]));
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [toggles, setToggles] = useState({
    anniversaryPosts: true,
    birthdayRemembrance: true,
    biometricPublic: false,
    familyMemories: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  function toggleTrait(trait: string) {
    setSelectedTraits((prev) => {
      const next = new Set(prev);
      if (next.has(trait)) next.delete(trait);
      else next.add(trait);
      return next;
    });
  }

  function addCustomTrait() {
    const val = customTraitInput.trim();
    if (!val) return;
    setCustomTraits((prev) => [...prev, val]);
    setSelectedTraits((prev) => new Set(prev).add(val));
    setCustomTraitInput("");
  }

  function toggleDevice(id: string) {
    setConnectedDevices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 8);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoPreviews((prev) => [...prev, ev.target?.result as string].slice(0, 20));
      };
      reader.readAsDataURL(file);
    });
  }

  function toggleSetting(key: keyof typeof toggles) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const allTraits = [...DEFAULT_TRAITS, ...customTraits];

  return (
    <div className="pt-30 pb-20 px-12 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="mb-16">
        <p className="text-[10px] tracking-[5px] text-gold uppercase mb-4">
          Step 01 — Your Story
        </p>
        <h1 className="font-serif text-[56px] font-light leading-none mb-4">
          Tell us
          <br />
          <em className="italic text-gold">who you are</em>
        </h1>
        <p className="text-muted text-[12px] tracking-[1px] leading-8">
          This is your legacy profile. Be as honest, as vivid, as you as
          possible.
          <br />
          No one will see this until you choose — or until you&apos;re gone.
        </p>
      </div>

      {/* Personal Details */}
      <section className="mb-14 pb-14 border-b border-border">
        <SectionLabel>Personal Details</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup label="First Name">
            <input type="text" placeholder="James" />
          </FormGroup>
          <FormGroup label="Last Name">
            <input type="text" placeholder="Okonkwo" />
          </FormGroup>
          <FormGroup label="Date of Birth">
            <input type="date" />
          </FormGroup>
          <FormGroup label="Place of Birth">
            <input type="text" placeholder="Lagos, Nigeria" />
          </FormGroup>
          <FormGroup
            label="A sentence about yourself — as raw and real as possible"
            full
          >
            <textarea placeholder="I'm someone who cries at sunsets, loves arguing about football, and makes the best jollof rice in the family. I was never the best at goodbyes." />
          </FormGroup>
          <FormGroup
            label="What do you want people to remember most about you?"
            full
          >
            <textarea placeholder="That I always showed up. Even when it was hard. Even when I was scared." />
          </FormGroup>
        </div>
      </section>

      {/* Photos */}
      <section className="mb-14 pb-14 border-b border-border">
        <SectionLabel>Your Best Photos</SectionLabel>
        <p className="text-muted text-[12px] tracking-[1px] leading-8 mb-6">
          Upload photos where you feel most yourself. Candid, posed, wherever —
          as long as they feel like <em className="italic">you</em>.
        </p>

        <div
          className="border border-dashed border-border p-12 text-center cursor-pointer transition-all duration-300 relative overflow-hidden hover:border-gold hover:bg-gold-dim"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <div className="w-12 h-12 border border-border flex items-center justify-center mx-auto mb-4 text-2xl text-gold">
            ✦
          </div>
          <div className="text-[11px] tracking-[2px] text-muted">
            Click or drag to upload your photos
          </div>
          <div className="text-[9px] tracking-[1px] text-muted/50 mt-2">
            JPG, PNG, WEBP — up to 20 photos
          </div>
        </div>

        {photoPreviews.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {photoPreviews.map((src, i) => (
              <div
                key={i}
                className="aspect-square bg-surface-2 border border-border overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Upload ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Traits */}
      <section className="mb-14 pb-14 border-b border-border">
        <SectionLabel>Your Defining Traits</SectionLabel>
        <p className="text-muted text-[12px] tracking-[1px] leading-8 mb-6">
          Select traits that feel genuinely you. Add your own.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {allTraits.map((trait) => (
            <button
              key={trait}
              onClick={() => toggleTrait(trait)}
              className={`px-4 py-2 border text-[10px] tracking-[2px] uppercase cursor-pointer transition-all duration-200 ${
                selectedTraits.has(trait)
                  ? "border-gold text-gold bg-gold-dim"
                  : "border-border text-muted hover:border-gold hover:text-gold hover:bg-gold-dim"
              }`}
            >
              {trait}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customTraitInput}
            onChange={(e) => setCustomTraitInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomTrait()}
            placeholder="Add your own trait..."
            className="flex-1"
          />
          <button
            onClick={addCustomTrait}
            className="bg-transparent border border-border text-gold px-6 text-xl cursor-pointer transition-all duration-200 hover:border-gold hover:bg-gold-dim shrink-0"
          >
            +
          </button>
        </div>
      </section>

      {/* Biometric Legacy */}
      <section className="mb-14 pb-14 border-b border-border">
        <SectionLabel>Biometric Legacy</SectionLabel>
        <p className="text-muted text-[12px] tracking-[1px] leading-8 mb-6">
          Your data tells the story of how you lived. Connect your health
          devices to preserve these insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface border border-border p-6 text-center transition-colors hover:border-gold">
            <div className="font-serif text-[40px] text-gold leading-none mb-1">
              7.2
            </div>
            <div className="text-[9px] tracking-[3px] uppercase text-muted">
              Avg Sleep (hrs)
            </div>
          </div>
          <div className="bg-surface border border-border p-6 text-center transition-colors hover:border-gold">
            <div className="font-serif text-[40px] text-gold leading-none mb-1">
              82
            </div>
            <div className="text-[9px] tracking-[3px] uppercase text-muted">
              Recovery Score
            </div>
          </div>
          <div className="bg-surface border border-border p-6 text-center transition-colors hover:border-gold">
            <div className="font-serif text-[40px] text-gold leading-none mb-1">
              68
            </div>
            <div className="text-[9px] tracking-[3px] uppercase text-muted">
              Resting HR (bpm)
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {HEALTH_DEVICES.map((device) => {
            const connected = connectedDevices.has(device.id);
            return (
              <button
                key={device.id}
                onClick={() => toggleDevice(device.id)}
                className={`flex items-center gap-2.5 px-5 py-3 border text-[10px] tracking-[2px] cursor-pointer transition-all duration-300 ${
                  connected
                    ? "border-gold text-gold bg-gold-dim"
                    : "border-border text-ivory hover:border-gold hover:text-gold"
                }`}
              >
                <span className="text-lg">{device.icon}</span>
                {connected ? device.connectedLabel : device.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Memorial Preferences */}
      <section className="mb-14 pb-14 border-b border-border">
        <SectionLabel>Memorial Preferences</SectionLabel>
        <div className="text-[11px] tracking-[1px] text-muted leading-8 mb-6">
          Decide how your legacy should be shared after you&apos;re gone. These
          preferences guide what gets posted, when, and to whom.
        </div>

        <ToggleRow
          label="Annual death anniversary posts"
          desc="Share a memory or trivia about you on each anniversary"
          enabled={toggles.anniversaryPosts}
          onToggle={() => toggleSetting("anniversaryPosts")}
        />
        <ToggleRow
          label="Birthday remembrances"
          desc="Remind loved ones of your birthday each year"
          enabled={toggles.birthdayRemembrance}
          onToggle={() => toggleSetting("birthdayRemembrance")}
        />
        <ToggleRow
          label="Share biometric insights publicly"
          desc="Allow your health data to be shown on your memorial"
          enabled={toggles.biometricPublic}
          onToggle={() => toggleSetting("biometricPublic")}
        />
        <ToggleRow
          label="Allow family to add memories"
          desc="Trusted contacts can contribute photos and stories"
          enabled={toggles.familyMemories}
          onToggle={() => toggleSetting("familyMemories")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <FormGroup label="Trusted Guardian (name)">
            <input
              type="text"
              placeholder="Who will manage your memorial?"
            />
          </FormGroup>
          <FormGroup label="Guardian Email">
            <input type="email" placeholder="guardian@example.com" />
          </FormGroup>
          <FormGroup
            label="Final message — words you want read on your first anniversary"
            full
          >
            <textarea placeholder="If you're reading this, then I'm gone. And I just want you to know..." />
          </FormGroup>
        </div>
      </section>

      <Link
        href="/dashboard"
        className="block w-full bg-gold text-black text-center px-10 py-4 text-[10px] tracking-[4px] uppercase font-normal transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]"
      >
        Save & Continue to My Legacy &rarr;
      </Link>
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
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${full ? "md:col-span-2" : ""}`}>
      <label className="text-[9px] tracking-[3px] uppercase text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  enabled,
  onToggle,
}: {
  label: string;
  desc: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-border">
      <div>
        <div className="text-[11px] tracking-[1px] text-ivory">{label}</div>
        <div className="text-[10px] text-muted mt-0.5">{desc}</div>
      </div>
      <button
        onClick={onToggle}
        className={`w-11 h-6 rounded-full relative cursor-pointer shrink-0 transition-all duration-300 ${
          enabled
            ? "bg-gold-dim border border-gold"
            : "bg-surface-2 border border-border"
        }`}
      >
        <span
          className={`absolute w-4 h-4 rounded-full top-[3px] transition-all duration-300 ${
            enabled ? "left-[21px] bg-gold" : "left-[3px] bg-muted"
          }`}
        />
      </button>
    </div>
  );
}
