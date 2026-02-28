"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "My Legacy" },
  { href: "/library", label: "Library" },
  { href: "/dreams", label: "Dreams" },
  { href: "/memorial", label: "Memorial Preview" },
  { href: "/register", label: "Begin" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const mobileOpen = menuPath === pathname;

  function isActive(href: string) {
    if (href === "/") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 border-b border-transparent bg-gradient-to-b from-black/95 to-transparent">
      <div className="px-5 md:px-12 py-4 md:py-6 flex items-center justify-between">
        <Link href="/" className="block">
          <div className="font-serif text-[24px] md:text-[28px] font-light tracking-[6px] md:tracking-[8px] text-gold uppercase">
            Immortal
            <span className="block font-sans text-ivory/50 text-[10px] md:text-[11px] tracking-[2px] md:tracking-[3px] -mt-1">
              Live forever in memory
            </span>
          </div>
        </Link>

        <ul className="hidden md:flex gap-8 list-none">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-[11px] tracking-[3px] uppercase transition-colors duration-300 no-underline ${
                  isActive(link.href)
                    ? "text-gold"
                    : "text-muted hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="md:hidden border border-border px-3 py-2 text-[9px] tracking-[2px] uppercase text-gold"
          onClick={() =>
            setMenuPath((prev) => (prev === pathname ? null : pathname))
          }
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div
        className={`md:hidden px-5 transition-[max-height,opacity,padding] duration-300 overflow-hidden ${
          mobileOpen
            ? "max-h-[420px] opacity-100 pb-4 border-t border-border"
            : "max-h-0 opacity-0 pb-0"
        }`}
      >
        <ul className="list-none pt-4 space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuPath(null)}
                className={`block px-2 py-2 text-[10px] tracking-[3px] uppercase transition-colors ${
                  isActive(link.href)
                    ? "text-gold"
                    : "text-muted hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
