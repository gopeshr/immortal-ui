import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen text-center overflow-hidden">
      {/* Background radials */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(201,168,76,0.06)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_20%,rgba(201,168,76,0.04)_0%,transparent_60%)]" />

      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold to-transparent opacity-15 -translate-x-1/2" />

      {/* Hero content */}
      <div className="relative z-2 max-w-[720px] px-10 pt-30 pb-20">
        <p className="animate-fade-in-delay-1 text-[10px] tracking-[6px] uppercase text-gold mb-8">
          You will not be forgotten
        </p>

        <h1 className="animate-fade-in-delay-2 font-serif text-[clamp(64px,10vw,120px)] font-light leading-[0.9] -tracking-[2px] mb-8">
          Live
          <br />
          <em className="italic text-gold">Forever</em>
          <br />
          in Memory
        </h1>

        <p className="animate-fade-in-delay-3 text-[13px] tracking-[2px] text-muted leading-8 max-w-[480px] mx-auto mb-14">
          Immortal preserves the full texture of who you are &mdash; your
          stories, your face, your sleep, your spirit &mdash; so the people you
          love can hold onto you, always.
        </p>

        <div className="animate-fade-in-delay-4 flex gap-4 justify-center flex-wrap">
          <Link
            href="/register"
            className="bg-gold text-black px-10 py-4 text-[10px] tracking-[4px] uppercase font-normal transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]"
          >
            Begin Your Legacy
          </Link>
          <Link
            href="/memorial"
            className="bg-transparent text-ivory border border-border px-10 py-4 text-[10px] tracking-[4px] uppercase font-light transition-all duration-300 hover:border-gold hover:text-gold"
          >
            See a Memorial
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="animate-fade-in-delay-5 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted text-[9px] tracking-[3px] uppercase">
        <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent animate-scroll-pulse" />
        Scroll
      </div>
    </div>
  );
}
