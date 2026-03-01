"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { API_BASE, ApiError, api, getApiErrorMessage } from "@/lib/api";

interface UserProfileResponse {
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  place_of_birth: string | null;
  personal_statement: string | null;
  remember_statement: string | null;
}

interface DefaultTraitsResponse {
  traits: string[];
}

interface TraitResponse {
  trait_name: string;
  is_custom: boolean;
}

interface DeviceResponse {
  device_type: string;
  connected: boolean;
}

interface HealthStatsResponse {
  avg_sleep: number;
  recovery_score: number;
  resting_hr: number;
}

interface MemorialPreferencesResponse {
  anniversary_posts: boolean;
  birthday_remembrance: boolean;
  biometric_public: boolean;
  family_memories: boolean;
  guardian_name: string | null;
  guardian_email: string | null;
  final_message: string | null;
}

interface PhotoResponse {
  id: string;
  file_path: string;
  original_filename: string;
}

const FALLBACK_DEFAULT_TRAITS = [
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
  {
    id: "whoop",
    icon: "\u231A",
    label: "WHOOP",
    connectedLabel: "WHOOP Connected",
  },
  {
    id: "apple",
    icon: "\uD83C\uDF4E",
    label: "Apple Health",
    connectedLabel: "Apple Health Connected",
  },
  {
    id: "garmin",
    icon: "\uD83C\uDFC3",
    label: "Garmin",
    connectedLabel: "Garmin Connected",
  },
  {
    id: "fitbit",
    icon: "\uD83D\uDC9A",
    label: "Fitbit",
    connectedLabel: "Fitbit Connected",
  },
];

function resolveAssetUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_BASE}${path}`;
  return `${API_BASE}/${path}`;
}

function splitTraits(selected: string[], defaults: string[]) {
  const defaultSet = new Set(defaults);
  return {
    traits: selected.filter((name) => defaultSet.has(name)),
    custom_traits: selected.filter((name) => !defaultSet.has(name)),
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const auth = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [syncingDeviceId, setSyncingDeviceId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    personalStatement: "",
    rememberStatement: "",
  });

  const [defaultTraits, setDefaultTraits] = useState<string[]>(
    FALLBACK_DEFAULT_TRAITS
  );
  const [selectedTraits, setSelectedTraits] = useState<Set<string>>(new Set());
  const [customTraits, setCustomTraits] = useState<string[]>([]);
  const [customTraitInput, setCustomTraitInput] = useState("");

  const [connectedDevices, setConnectedDevices] = useState<Set<string>>(
    new Set()
  );

  const [healthStats, setHealthStats] = useState({
    avgSleep: 7.2,
    recoveryScore: 82,
    restingHr: 68,
  });

  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const [memorial, setMemorial] = useState({
    anniversaryPosts: true,
    birthdayRemembrance: true,
    biometricPublic: false,
    familyMemories: true,
    guardianName: "",
    guardianEmail: "",
    finalMessage: "",
  });

  useEffect(() => {
    if (auth.isLoading || !auth.user) return;

    let ignore = false;

    const bootstrap = async () => {
      setIsBootstrapping(true);
      setServerError(null);

      try {
        const [
          user,
          defaults,
          traits,
          devices,
          prefs,
          photos,
          stats,
        ] = await Promise.all([
          api<UserProfileResponse>("/api/users/me"),
          api<DefaultTraitsResponse>("/api/traits/defaults"),
          api<TraitResponse[]>("/api/traits"),
          api<DeviceResponse[]>("/api/health/devices"),
          api<MemorialPreferencesResponse>("/api/memorial/preferences"),
          api<PhotoResponse[]>("/api/photos"),
          (async () => {
            try {
              return await api<HealthStatsResponse>("/api/health/stats");
            } catch (error) {
              if (error instanceof ApiError && error.status === 404) return null;
              throw error;
            }
          })(),
        ]);

        if (ignore) return;

        setProfile({
          firstName: user.first_name ?? "",
          lastName: user.last_name ?? "",
          dateOfBirth: user.date_of_birth ?? "",
          placeOfBirth: user.place_of_birth ?? "",
          personalStatement: user.personal_statement ?? "",
          rememberStatement: user.remember_statement ?? "",
        });

        const traitDefaults =
          defaults.traits && defaults.traits.length > 0
            ? defaults.traits
            : FALLBACK_DEFAULT_TRAITS;
        setDefaultTraits(traitDefaults);

        const selected = new Set(traits.map((item) => item.trait_name));
        const custom = traits
          .filter((item) => item.is_custom)
          .map((item) => item.trait_name);

        setSelectedTraits(selected);
        setCustomTraits(custom);

        const connected = new Set(
          devices
            .filter((item) => item.connected)
            .map((item) => item.device_type)
        );
        setConnectedDevices(connected);

        if (stats) {
          setHealthStats({
            avgSleep: stats.avg_sleep,
            recoveryScore: stats.recovery_score,
            restingHr: stats.resting_hr,
          });
        }

        setMemorial({
          anniversaryPosts: prefs.anniversary_posts,
          birthdayRemembrance: prefs.birthday_remembrance,
          biometricPublic: prefs.biometric_public,
          familyMemories: prefs.family_memories,
          guardianName: prefs.guardian_name ?? "",
          guardianEmail: prefs.guardian_email ?? "",
          finalMessage: prefs.final_message ?? "",
        });

        setPhotoPreviews(photos.map((photo) => resolveAssetUrl(photo.file_path)));
      } catch (error) {
        if (!ignore) {
          setServerError(getApiErrorMessage(error, "Failed to load profile data"));
        }
      } finally {
        if (!ignore) setIsBootstrapping(false);
      }
    };

    void bootstrap();

    return () => {
      ignore = true;
    };
  }, [auth.isLoading, auth.user]);

  const allTraits = useMemo(
    () => [...defaultTraits, ...customTraits],
    [defaultTraits, customTraits]
  );

  function toggleTrait(trait: string) {
    setSelectedTraits((prev) => {
      const next = new Set(prev);
      if (next.has(trait)) next.delete(trait);
      else next.add(trait);
      return next;
    });
  }

  function addCustomTrait() {
    const value = customTraitInput.trim();
    if (!value) return;

    if (!customTraits.includes(value)) {
      setCustomTraits((prev) => [...prev, value]);
    }

    setSelectedTraits((prev) => new Set(prev).add(value));
    setCustomTraitInput("");
  }

  async function syncDevicesAndStats() {
    const [devices, stats] = await Promise.all([
      api<DeviceResponse[]>("/api/health/devices"),
      (async () => {
        try {
          return await api<HealthStatsResponse>("/api/health/stats");
        } catch (error) {
          if (error instanceof ApiError && error.status === 404) return null;
          throw error;
        }
      })(),
    ]);

    setConnectedDevices(
      new Set(devices.filter((item) => item.connected).map((item) => item.device_type))
    );

    if (stats) {
      setHealthStats({
        avgSleep: stats.avg_sleep,
        recoveryScore: stats.recovery_score,
        restingHr: stats.resting_hr,
      });
    }
  }

  async function toggleDevice(id: string) {
    setServerError(null);
    setSyncingDeviceId(id);

    try {
      await api("/api/health/devices/connect", {
        method: "POST",
        body: { device_type: id },
      });
      await syncDevicesAndStats();
    } catch (error) {
      setServerError(getApiErrorMessage(error, "Failed to update health device"));
    } finally {
      setSyncingDeviceId(null);
    }
  }

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setServerError(null);
    setIsUploadingPhotos(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      await api<PhotoResponse[]>("/api/photos", {
        method: "POST",
        body: formData,
      });
      const refreshed = await api<PhotoResponse[]>("/api/photos");
      setPhotoPreviews(refreshed.map((photo) => resolveAssetUrl(photo.file_path)));
    } catch (error) {
      setServerError(getApiErrorMessage(error, "Photo upload failed"));
    } finally {
      setIsUploadingPhotos(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function toggleSetting(key: keyof typeof memorial) {
    setMemorial((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSaveAndContinue() {
    if (isSaving) return;

    setServerError(null);
    setIsSaving(true);

    try {
      await api("/api/users/me", {
        method: "PUT",
        body: {
          first_name: profile.firstName || null,
          last_name: profile.lastName || null,
          date_of_birth: profile.dateOfBirth || null,
          place_of_birth: profile.placeOfBirth || null,
          personal_statement: profile.personalStatement || null,
          remember_statement: profile.rememberStatement || null,
        },
      });

      const selected = Array.from(selectedTraits);
      const payload = splitTraits(selected, defaultTraits);

      await api("/api/traits", {
        method: "POST",
        body: payload,
      });

      await api("/api/memorial/preferences", {
        method: "PUT",
        body: {
          anniversary_posts: memorial.anniversaryPosts,
          birthday_remembrance: memorial.birthdayRemembrance,
          biometric_public: memorial.biometricPublic,
          family_memories: memorial.familyMemories,
          guardian_name: memorial.guardianName || null,
          guardian_email: memorial.guardianEmail || null,
          final_message: memorial.finalMessage || null,
        },
      });

      router.push("/dashboard");
    } catch (error) {
      setServerError(getApiErrorMessage(error, "Failed to save onboarding data"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ProtectedRoute>
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

        {isBootstrapping && (
          <div className="mb-10 text-[10px] tracking-[3px] uppercase text-gold">
            Syncing your onboarding data...
          </div>
        )}

        {serverError && (
          <div className="mb-8 border border-[#d38787]/40 bg-[#d38787]/10 px-5 py-3 text-[11px] text-[#f1c6c6]">
            {serverError}
          </div>
        )}

        {/* Personal Details */}
        <section className="mb-14 pb-14 border-b border-border">
          <SectionLabel>Personal Details</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormGroup label="First Name">
              <input
                type="text"
                placeholder="James"
                value={profile.firstName}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, firstName: event.target.value }))
                }
              />
            </FormGroup>
            <FormGroup label="Last Name">
              <input
                type="text"
                placeholder="Okonkwo"
                value={profile.lastName}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, lastName: event.target.value }))
                }
              />
            </FormGroup>
            <FormGroup label="Date of Birth">
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    dateOfBirth: event.target.value,
                  }))
                }
              />
            </FormGroup>
            <FormGroup label="Place of Birth">
              <input
                type="text"
                placeholder="Lagos, Nigeria"
                value={profile.placeOfBirth}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    placeOfBirth: event.target.value,
                  }))
                }
              />
            </FormGroup>
            <FormGroup
              label="A sentence about yourself — as raw and real as possible"
              full
            >
              <textarea
                value={profile.personalStatement}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    personalStatement: event.target.value,
                  }))
                }
                placeholder="I'm someone who cries at sunsets, loves arguing about football, and makes the best jollof rice in the family. I was never the best at goodbyes."
              />
            </FormGroup>
            <FormGroup
              label="What do you want people to remember most about you?"
              full
            >
              <textarea
                value={profile.rememberStatement}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    rememberStatement: event.target.value,
                  }))
                }
                placeholder="That I always showed up. Even when it was hard. Even when I was scared."
              />
            </FormGroup>
          </div>
        </section>

        {/* Photos */}
        <section className="mb-14 pb-14 border-b border-border">
          <SectionLabel>Your Best Photos</SectionLabel>
          <p className="text-muted text-[12px] tracking-[1px] leading-8 mb-6">
            Upload photos where you feel most yourself. Candid, posed, wherever
            — as long as they feel like <em className="italic">you</em>.
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
              {isUploadingPhotos
                ? "Uploading photos..."
                : "Click or drag to upload your photos"}
            </div>
            <div className="text-[9px] tracking-[1px] text-muted/50 mt-2">
              JPG, PNG, WEBP — up to 20 photos
            </div>
          </div>

          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {photoPreviews.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="aspect-square bg-surface-2 border border-border overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`Upload ${index + 1}`}
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
                type="button"
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
              onChange={(event) => setCustomTraitInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addCustomTrait();
                }
              }}
              placeholder="Add your own trait..."
              className="flex-1"
            />
            <button
              type="button"
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
                {healthStats.avgSleep.toFixed(1)}
              </div>
              <div className="text-[9px] tracking-[3px] uppercase text-muted">
                Avg Sleep (hrs)
              </div>
            </div>
            <div className="bg-surface border border-border p-6 text-center transition-colors hover:border-gold">
              <div className="font-serif text-[40px] text-gold leading-none mb-1">
                {healthStats.recoveryScore}
              </div>
              <div className="text-[9px] tracking-[3px] uppercase text-muted">
                Recovery Score
              </div>
            </div>
            <div className="bg-surface border border-border p-6 text-center transition-colors hover:border-gold">
              <div className="font-serif text-[40px] text-gold leading-none mb-1">
                {healthStats.restingHr}
              </div>
              <div className="text-[9px] tracking-[3px] uppercase text-muted">
                Resting HR (bpm)
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {HEALTH_DEVICES.map((device) => {
              const connected = connectedDevices.has(device.id);
              const syncing = syncingDeviceId === device.id;

              return (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => void toggleDevice(device.id)}
                  disabled={syncing}
                  className={`flex items-center gap-2.5 px-5 py-3 border text-[10px] tracking-[2px] cursor-pointer transition-all duration-300 disabled:opacity-60 ${
                    connected
                      ? "border-gold text-gold bg-gold-dim"
                      : "border-border text-ivory hover:border-gold hover:text-gold"
                  }`}
                >
                  <span className="text-lg">{device.icon}</span>
                  {syncing
                    ? "Syncing..."
                    : connected
                      ? device.connectedLabel
                      : device.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Memorial Preferences */}
        <section className="mb-14 pb-14 border-b border-border">
          <SectionLabel>Memorial Preferences</SectionLabel>
          <div className="text-[11px] tracking-[1px] text-muted leading-8 mb-6">
            Decide how your legacy should be shared after you&apos;re gone.
            These preferences guide what gets posted, when, and to whom.
          </div>

          <ToggleRow
            label="Annual death anniversary posts"
            desc="Share a memory or trivia about you on each anniversary"
            enabled={memorial.anniversaryPosts}
            onToggle={() => toggleSetting("anniversaryPosts")}
          />
          <ToggleRow
            label="Birthday remembrances"
            desc="Remind loved ones of your birthday each year"
            enabled={memorial.birthdayRemembrance}
            onToggle={() => toggleSetting("birthdayRemembrance")}
          />
          <ToggleRow
            label="Share biometric insights publicly"
            desc="Allow your health data to be shown on your memorial"
            enabled={memorial.biometricPublic}
            onToggle={() => toggleSetting("biometricPublic")}
          />
          <ToggleRow
            label="Allow family to add memories"
            desc="Trusted contacts can contribute photos and stories"
            enabled={memorial.familyMemories}
            onToggle={() => toggleSetting("familyMemories")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <FormGroup label="Trusted Guardian (name)">
              <input
                type="text"
                placeholder="Who will manage your memorial?"
                value={memorial.guardianName}
                onChange={(event) =>
                  setMemorial((prev) => ({
                    ...prev,
                    guardianName: event.target.value,
                  }))
                }
              />
            </FormGroup>
            <FormGroup label="Guardian Email">
              <input
                type="email"
                placeholder="guardian@example.com"
                value={memorial.guardianEmail}
                onChange={(event) =>
                  setMemorial((prev) => ({
                    ...prev,
                    guardianEmail: event.target.value,
                  }))
                }
              />
            </FormGroup>
            <FormGroup
              label="Final message — words you want read on your first anniversary"
              full
            >
              <textarea
                value={memorial.finalMessage}
                onChange={(event) =>
                  setMemorial((prev) => ({
                    ...prev,
                    finalMessage: event.target.value,
                  }))
                }
                placeholder="If you're reading this, then I'm gone. And I just want you to know..."
              />
            </FormGroup>
          </div>
        </section>

        <button
          type="button"
          onClick={() => void handleSaveAndContinue()}
          disabled={isSaving || isBootstrapping}
          className="block w-full bg-gold text-black text-center px-10 py-4 text-[10px] tracking-[4px] uppercase font-normal transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSaving
            ? "Saving Your Legacy..."
            : "Save & Continue to My Legacy \u2192"}
        </button>
      </div>
    </ProtectedRoute>
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
        type="button"
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
