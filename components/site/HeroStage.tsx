"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { FigureFrame } from "@/components/site/FigureFrame";
import { TranscriptRain } from "@/components/site/TranscriptRain";

const cards = [
  { x: 250, label: "01" },
  { x: 292, label: "02" },
  { x: 334, label: "03" },
];

export function HeroStage({ transcript }: { transcript: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const rigRef = useRef<SVGGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const rig = rigRef.current;
    const title = titleRef.current;
    if (!section || !rig || !title) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches || reduce.matches) return;

    let revert = () => {};
    let cancelled = false;

    void (async () => {
      const gsapModule = await import("gsap");
      const scrollModule = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const cardNodes = rig.querySelectorAll(".clip-card");
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 1.5)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      timeline.fromTo(rig, { rotate: -11 }, { rotate: 24, ease: "none", svgOrigin: "210 250" }, 0);
      timeline.fromTo(
        cardNodes,
        { x: 0, y: 0 },
        { x: 150, y: (index) => index * 78 - 70, ease: "none", stagger: 0.02 },
        0,
      );
      timeline.fromTo(title, { fontVariationSettings: '"wdth" 75' }, { fontVariationSettings: '"wdth" 112.5', ease: "none" }, 0);
      revert = () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    })();

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <section className="hero" ref={sectionRef}>
      <TranscriptRain source={transcript} />
      <div className="wrap hero-copy">
        <p className="typed-line">
          &gt; give me a lever and a place to stand, and i&apos;ll move the world
          <span className="caret">_</span>
        </p>
        <h1 ref={titleRef}>
          Your show is the place to stand.
          <br />
          We&apos;re the lever.
        </h1>
        <FigureFrame n="01">
          <div className="hero-art">
            <svg className="lever-scene" viewBox="0 0 640 420" role="img" aria-label="A machined lever. An episode slab presses the short end. The long end flings vertical cards into a feed column.">
              <g className="feed-guides" aria-hidden="true">
                <rect x="520" y="36" width="86" height="154" />
                <rect x="520" y="204" width="86" height="154" />
              </g>
              <polygon className="scene-fulcrum" points="210,268 196,292 224,292" />
              <g className="lever-rig" ref={rigRef}>
                <rect className="episode-slab" x="28" y="214" width="108" height="52" rx="4" />
                <text className="slab-label" x="82" y="245" textAnchor="middle">
                  EP. 01
                </text>
                <rect className="beam" x="128" y="234" width="250" height="12" rx="2" />
                {cards.map((card) => (
                  <g key={card.label} transform={`translate(${card.x} 150)`}>
                    <g className="clip-card">
                      <rect width="46" height="82" rx="4" />
                      <text x="23" y="46" textAnchor="middle">
                        {card.label}
                      </text>
                    </g>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </FigureFrame>
        <p className="lead">
          Daily Shorts, TikToks, Reels, and LinkedIn clips cut from the episodes you already record. Posted on your accounts, after you approve.
        </p>
        <div className="btn-row">
          <Link className="btn btn-primary btn-lg" href="/sample">
            Get 3 free clips
          </Link>
          <a className="btn btn-secondary btn-lg" href="#packages">
            Pick your pill
          </a>
        </div>
        <p className="microline">No bots. No fake views. No B*llsh*t.</p>
      </div>
    </section>
  );
}
