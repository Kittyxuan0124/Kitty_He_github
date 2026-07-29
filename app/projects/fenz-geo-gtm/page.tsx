"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Database,
  Layers3,
  Search,
  ShieldCheck,
} from "lucide-react";
import { CSSProperties, useEffect, useState } from "react";

const sections = [
  ["shift", "The shift"],
  ["audit", "Brand audit"],
  ["method", "DSS method"],
  ["platforms", "Platform lens"],
  ["prompts", "Prompt map"],
  ["demo", "Demo"],
] as const;

const methods = [
  {
    key: "depth",
    number: "D",
    title: "Semantic Depth",
    subtitle: "Meaning in context",
    copy: "Information richness, analytical depth, logical rigor and context continuity — content that answers a deeper need instead of merely listing facts.",
  },
  {
    key: "support",
    number: "S",
    title: "Data Support",
    subtitle: "Evidence in motion",
    copy: "Claims grounded in verifiable facts, reliable data, concrete cases and explicit evidence, strengthening objectivity and trust.",
  },
  {
    key: "source",
    number: "S",
    title: "Authoritative Source",
    subtitle: "Credibility at source",
    copy: "Recognized expertise, reputation and credible source material — the signals that give a brand meaningful authority in an AI answer.",
  },
];

const platforms = [
  {
    name: "DeepSeek",
    signal: "Diverse UGC + media",
    detail: "Sohu · NetEase · SMZDM · Baijiahao · Tencent",
  },
  {
    name: "Yuanbao",
    signal: "Tencent ecosystem",
    detail: "WeChat Official Accounts · Tencent News · mainstream media",
  },
  {
    name: "Doubao",
    signal: "ByteDance ecosystem",
    detail: "Toutiao · Douyin · Baike · selected UGC",
  },
  {
    name: "Kimi",
    signal: "UGC + editorial",
    detail: "Zhihu · SMZDM · Bilibili · Sohu · NetEase",
  },
];

const promptLayers = [
  {
    number: "01",
    title: "High-frequency need",
    copy: "Category discovery, value perception and the questions people ask before a shortlist exists.",
  },
  {
    number: "02",
    title: "Core decision",
    copy: "Price, fit, comparison and scenario-led prompts that shape the final choice.",
  },
  {
    number: "03",
    title: "Functional proof",
    copy: "Feature compatibility, performance and service questions that reduce uncertainty.",
  },
  {
    number: "04",
    title: "Long-tail context",
    copy: "Specific situations where a precise, credible answer can create disproportionate influence.",
  },
];

export default function FenzGeoGtmPage() {
  const [active, setActive] = useState("shift");
  const [method, setMethod] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      setProgress(Math.min(1, Math.max(0, window.scrollY / total)));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActive(current.target.id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.05, 0.2, 0.5] },
    );
    sections.forEach(([id]) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <main className="fenz-page">
      <div
        className="fenz-progress"
        style={{ "--progress": progress } as CSSProperties}
        aria-hidden
      />

      <header className="fenz-header">
        <a href="/#project" className="fenz-back">
          <ArrowLeft size={15} strokeWidth={1.4} />
          Xuan He · Projects
        </a>
        <nav aria-label="Deck sections">
          {sections.map(([id, label], index) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "is-active" : ""}
            >
              <span>0{index + 1}</span>
              {label}
            </a>
          ))}
        </nav>
        <a
          className="fenz-site-link"
          href="https://fenz.ai/"
          target="_blank"
          rel="noreferrer"
        >
          fenz.ai <ArrowUpRight size={14} strokeWidth={1.4} />
        </a>
      </header>

      <section className="fenz-hero">
        <div className="fenz-grid" aria-hidden />
        <p className="fenz-hero-index">WEB DECK · 2025</p>
        <div className="fenz-hero-title">
          <div className="fenz-brand-lockup">
            <img src="/fenz/fenz-shield.png" alt="Fenz AI shield" />
            <span>Fenz AI</span>
          </div>
          <h1>
            GEO
            <span>/</span>
            GTM
          </h1>
          <p>Audit and optimize how a brand appears in generative engines.</p>
        </div>
        <div className="fenz-hero-note">
          <span>Generative Engine Optimization</span>
          <p>
            A web adaptation of a strategic market deck — rebuilt as a
            scroll-led field study.
          </p>
        </div>
        <a className="fenz-scroll" href="#shift">
          Enter the narrative <ArrowDown size={15} strokeWidth={1.35} />
        </a>
      </section>

      <section id="shift" className="fenz-section fenz-shift">
        <div className="fenz-section-number">01 / THE SHIFT</div>
        <div className="fenz-shift-heading">
          <p>Search is becoming an answer layer.</p>
          <h2>
            From ranking links
            <br />
            to shaping <em>memory.</em>
          </h2>
        </div>
        <div className="fenz-stat-stage">
          <article>
            <strong>25%</strong>
            <p>
              of traditional search traffic is forecast to shift toward AI
              tools by 2026.
            </p>
          </article>
          <article>
            <strong>75.7%</strong>
            <p>
              of mobile first-screen space can be occupied by Google AIO and
              featured summaries.
            </p>
          </article>
          <article>
            <strong>58.5%</strong>
            <p>
              of searches can end without a click — visibility now begins
              before a website visit.
            </p>
          </article>
        </div>
      </section>

      <section id="audit" className="fenz-section fenz-audit">
        <div className="fenz-section-number">02 / BRAND AUDIT</div>
        <div className="fenz-audit-visual">
          <img src="/fenz/geo-terrain.jpeg" alt="" />
          <div className="fenz-audit-orbit" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </div>
          <p>What makes an AI answer trustworthy?</p>
        </div>
        <div className="fenz-audit-copy">
          <p className="fenz-kicker">Fenz GEO Audit</p>
          <h2>
            Brand presence is more than visibility. It is a question of
            integrity.
          </h2>
          <div className="fenz-audit-pillars">
            {["Safety", "Alignment", "Bias", "Factuality"].map(
              (pillar, index) => (
                <article key={pillar}>
                  <span>0{index + 1}</span>
                  <strong>{pillar}</strong>
                </article>
              ),
            )}
          </div>
          <p className="fenz-body-copy">
            GEO creates and optimizes the material that generative systems can
            discover, interpret and cite — helping a brand become an
            influential participant in the conversation.
          </p>
        </div>
      </section>

      <section id="method" className="fenz-section fenz-method">
        <div className="fenz-section-number">03 / DSS METHOD</div>
        <div className="fenz-method-heading">
          <p className="fenz-kicker">LLM-friendly by design</p>
          <h2>Three signals of AI-ready content.</h2>
          <p>
            Fenz frames trusted generative visibility through depth, evidence
            and authority — concrete signals in place of a vague checklist.
          </p>
        </div>
        <div className="fenz-method-lab">
          <div className="fenz-method-tabs" role="tablist">
            {methods.map((item, index) => (
              <button
                key={item.key}
                className={method === index ? "is-active" : ""}
                onClick={() => setMethod(index)}
                role="tab"
                aria-selected={method === index}
              >
                <span>{item.number}</span>
                {item.title}
              </button>
            ))}
          </div>
          <div className="fenz-method-reading" role="tabpanel">
            <span>0{method + 1}</span>
            <p>{methods[method].subtitle}</p>
            <h3>{methods[method].title}</h3>
            <p>{methods[method].copy}</p>
            <div className="fenz-method-icon" aria-hidden>
              {method === 0 && <Layers3 size={36} strokeWidth={1.1} />}
              {method === 1 && <Database size={36} strokeWidth={1.1} />}
              {method === 2 && <ShieldCheck size={36} strokeWidth={1.1} />}
            </div>
          </div>
        </div>
      </section>

      <section id="platforms" className="fenz-section fenz-platforms">
        <div className="fenz-section-number">04 / PLATFORM LENS</div>
        <div className="fenz-platform-heading">
          <p className="fenz-kicker">The source graph changes by platform</p>
          <h2>One message. Four information ecosystems.</h2>
        </div>
        <div className="fenz-platform-list">
          {platforms.map((platform, index) => (
            <article key={platform.name}>
              <span>0{index + 1}</span>
              <h3>{platform.name}</h3>
              <strong>{platform.signal}</strong>
              <p>{platform.detail}</p>
              <Search size={18} strokeWidth={1.1} />
            </article>
          ))}
        </div>
      </section>

      <section id="prompts" className="fenz-section fenz-prompts">
        <div className="fenz-section-number">05 / PROMPT MAP</div>
        <div className="fenz-prompt-heading">
          <p className="fenz-kicker">Audience intent, mapped in layers</p>
          <h2>A brand can enter the conversation at more than one depth.</h2>
        </div>
        <div className="fenz-prompt-orbit">
          <div className="fenz-orbit-core">
            <span>Brand</span>
            <strong>Direction</strong>
          </div>
          {promptLayers.map((layer, index) => (
            <article
              key={layer.title}
              style={{ "--prompt-index": index } as CSSProperties}
            >
              <span>{layer.number}</span>
              <h3>{layer.title}</h3>
              <p>{layer.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="demo" className="fenz-section fenz-demo">
        <div className="fenz-section-number">06 / DEMO</div>
        <div className="fenz-demo-heading">
          <div>
            <p className="fenz-kicker">GEO audit & optimization</p>
            <h2>Turn visibility into a measurable operating view.</h2>
          </div>
          <p>
            Monitor visibility, position, sentiment, accuracy, competitive
            presence and the content opportunities that follow.
          </p>
        </div>
        <div className="fenz-dashboard-frame">
          <div className="fenz-browser-bar">
            <span />
            <span />
            <span />
            <p>Fenz GEO intelligence workspace</p>
          </div>
          <img
            src="/fenz/geo-dashboard.jpeg"
            alt="Fenz GEO audit and optimization dashboard"
          />
        </div>
        <div className="fenz-closing">
          <p>Research translated into a web narrative by Xuan He.</p>
          <a href="https://fenz.ai/" target="_blank" rel="noreferrer">
            Explore fenz.ai <ArrowUpRight size={17} strokeWidth={1.25} />
          </a>
        </div>
      </section>
    </main>
  );
}
