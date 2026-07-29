import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume — Xuan He (Kitty)",
  description:
    "The independent web resume of Xuan He: strategy, creator ecosystems, business development and global community growth.",
};

const experience = [
  {
    period: "09/2025 — Present",
    location: "Houston / LA · Remote",
    company: "flinkbrandcoach",
    role: "HR & Talent Partnership · North America Creator Business",
    points: [
      "Built and maintained a database of 100+ U.S.-based creators across Instagram Creator Marketplace, Glewee, Facebook Groups and authorized LinkedIn outreach; achieved a 35% response rate and expanded the creator pool by 60%.",
      "Translated short-form content needs into creator profiles and screening criteria, supporting 10+ projects across creative, talent, production and client teams.",
      "Standardized screening, scheduling, onboarding, reminders and handoffs through shared SOPs.",
    ],
    href: "https://www.flinkbrandcoach.com",
  },
  {
    period: "08/2025 — 11/2025",
    location: "Remote",
    company: "Jaaz.ai",
    role: "User Operations & Growth Lead",
    points: [
      "Built a Discord community from zero to 1,000+ members in three months and tested multi-platform growth campaigns across X, Discord and Telegram, increasing weekly active users by 55%.",
      "Conducted international surveys and interviews, created an FAQ and feedback repository, reduced repetitive inquiries by 30%, and helped launch two product updates.",
    ],
  },
  {
    period: "06/2025 — 09/2025",
    location: "Palo Alto",
    company: "fenz.ai",
    role: "Business Development",
    points: [
      "Produced two strategic research deliverables, including a GEO / GTM deck that translated market signals, business drivers and competitive intelligence into positioning and outreach opportunities.",
      "Structured and tracked 50+ leads in CRM, converted 15% into pilot clients and secured five qualified partnerships through GenAI Summit 2025 and targeted follow-up.",
      "Standardized sales progress and follow-up reporting, improving team response efficiency by 20%.",
    ],
  },
];

const education = [
  {
    period: "09/2023 — 06/2027",
    school: "University of Shanghai for Science and Technology",
    degree: "International Finance and Trade · Sino-US Cooperative",
    detail: "GPA 3.81 · Management, Microeconomics, Corporate Finance, Business Analysis and American Literature",
  },
  {
    period: "06/2025 — 09/2025",
    school: "University of California, Los Angeles",
    degree: "Communication and Economics",
    detail: "GPA 3.7",
  },
];

const projects = [
  {
    title: "North America Creator Ecosystem",
    detail:
      "Mapped a discovery–outreach–screening–partnership funnel around a database of 100+ U.S. creators, a 35% response rate, 60% creator-pool growth and 10+ short-form projects.",
    href: "https://www.flinkbrandcoach.com",
    label: "flinkbrandcoach.com",
  },
  {
    title: "GEO / GTM Deck",
    detail:
      "Synthesized market context, competitive signals, business drivers and potential opportunities into a clear go-to-market narrative for fenz.ai.",
  },
  {
    title: "AGI Summit SF 2026 · Field Notes",
    detail:
      "Designed and deployed an editorial website translating an in-person AI gathering into an accessible digital record.",
    href: "https://agi-summit-2026-field-notes.kittyxuaxuan.chatgpt.site",
    label: "View live website",
  },
];

export default function ResumePage() {
  return (
    <main className="resume-page">
      <header className="resume-header">
        <a href="/" className="resume-wordmark">
          XH <span>✤</span>
        </a>
        <p>Curriculum Vitae · 2026</p>
        <nav aria-label="Resume actions">
          <a href="/" target="_self">
            Portfolio
          </a>
          <a href="/xuan-he-resume.pdf" target="_blank" rel="noreferrer">
            Original PDF ↗
          </a>
        </nav>
      </header>

      <section className="resume-hero">
        <div>
          <p className="resume-overline">
            Strategy · Creator ecosystems · Global communities
          </p>
          <h1>
            Xuan
            <br />
            He.
          </h1>
        </div>
        <div className="resume-intro">
          <p className="resume-script">Kitty, to most people.</p>
          <p>
            International Finance and Trade undergraduate working across North
            American creator ecosystems, business development, strategic
            research and global user operations. I turn research and
            relationships into momentum.
          </p>
          <div className="resume-contact-line">
            <a href="mailto:heykittyinworld@gmail.com">
              heykittyinworld@gmail.com
            </a>
            <span>Shanghai · available globally</span>
          </div>
        </div>
      </section>

      <section className="resume-signals" aria-label="Selected impact">
        <article>
          <strong>100+</strong>
          <span>U.S. creators mapped</span>
        </article>
        <article>
          <strong>35%</strong>
          <span>creator response rate</span>
        </article>
        <article>
          <strong>1,000+</strong>
          <span>community members in 3 months</span>
        </article>
        <article>
          <strong>55%</strong>
          <span>weekly active user growth</span>
        </article>
      </section>

      <section className="resume-section">
        <div className="resume-section-heading">
          <span>01</span>
          <p>Experience</p>
          <h2>Work in motion.</h2>
        </div>
        <div className="resume-timeline">
          {experience.map((item) => (
            <article key={`${item.company}-${item.period}`}>
              <div className="resume-meta">
                <time>{item.period}</time>
                <span>{item.location}</span>
              </div>
              <div>
                <p className="resume-role">{item.role}</p>
                <h3>{item.company}</h3>
                {item.href && (
                  <a href={item.href} target="_blank" rel="noreferrer">
                    Visit website ↗
                  </a>
                )}
              </div>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-section resume-education">
        <div className="resume-section-heading">
          <span>02</span>
          <p>Education</p>
          <h2>Learning across contexts.</h2>
        </div>
        <div className="resume-education-list">
          {education.map((item) => (
            <article key={item.school}>
              <time>{item.period}</time>
              <h3>{item.school}</h3>
              <p>{item.degree}</p>
              <small>{item.detail}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-section resume-projects">
        <div className="resume-section-heading">
          <span>03</span>
          <p>Selected projects</p>
          <h2>Signals into stories.</h2>
        </div>
        <div className="resume-project-list">
          {projects.map((project, index) => (
            <article key={project.title}>
              <span>0{index + 1}</span>
              <h3>{project.title}</h3>
              <p>{project.detail}</p>
              {project.href && (
                <a href={project.href} target="_blank" rel="noreferrer">
                  {project.label} ↗
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="resume-capabilities">
        <div>
          <p className="resume-overline">Capabilities</p>
          <h2>A thoughtful blend of structure and instinct.</h2>
        </div>
        <dl>
          <div>
            <dt>Analysis</dt>
            <dd>
              Market & industry research · Funnel analysis · User interviews ·
              Strategic reporting
            </dd>
          </div>
          <div>
            <dt>Growth</dt>
            <dd>
              Community operations · Creator ecosystems · Partnerships ·
              Cross-platform campaigns
            </dd>
          </div>
          <div>
            <dt>Tools</dt>
            <dd>
              Codex · Claude · Gemini · NotebookLM · Figma · Canva · Google
              Workspace
            </dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>
              Chinese (native) · English (professional) · French (fluent)
            </dd>
          </div>
        </dl>
      </section>

      <footer className="resume-footer">
        <div>
          <p className="resume-script">Let’s make something meaningful.</p>
          <a href="mailto:heykittyinworld@gmail.com">
            heykittyinworld@gmail.com ↗
          </a>
        </div>
        <p>© 2026 Xuan He · Quiet strength, patient bloom.</p>
      </footer>
    </main>
  );
}
