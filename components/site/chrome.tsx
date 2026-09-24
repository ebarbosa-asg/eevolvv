"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/site/art";

const links = [
  { href: "/packages/clip-and-ship", label: "Clip & Ship" },
  { href: "/packages/clip-and-dominate", label: "Clip & Dominate" },
  { href: "/niches/podcasts", label: "Podcasts" },
  { href: "/niches/saas", label: "SaaS" },
  { href: "/niches/coaches", label: "Coaches" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link className="logo" href="/" aria-label="eevolvv home">
          <LogoMark />
          eevolvv
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <ul className={open ? "nav-links open" : "nav-links"} id="site-nav">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link className="btn btn-primary" href="/#book">
              Book a call
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export function StickyBook() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      setOn(ratio > 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a className={on ? "sticky-book on" : "sticky-book"} href="/#book">
      Book a call
    </a>
  );
}
