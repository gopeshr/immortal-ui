"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "My Legacy" },
  { href: "/memorial", label: "Memorial Preview" },
  { href: "/register", label: "Begin" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-12 py-6 border-b border-transparent bg-gradient-to-b from-black/95 to-transparent">
      <Link href="/" className="block">
        <div className="font-serif text-[28px] font-light tracking-[8px] text-gold uppercase">
          Immortal
          <span className="block font-sans text-ivory/50 text-[11px] tracking-[3px] -mt-1">
            Live forever in memory
          </span>
        </div>
      </Link>

      <ul className="flex gap-10 list-none">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-[11px] tracking-[3px] uppercase transition-colors duration-300 no-underline ${
                pathname === link.href
                  ? "text-gold"
                  : "text-muted hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
