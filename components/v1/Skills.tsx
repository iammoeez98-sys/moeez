"use client";
import { useEffect, useRef, useState } from "react";

const tools = [
  ["figma", "Figma"], ["photoshop", "Photoshop"], ["cursor", "Cursor"],
  ["claude", "Claude"], ["antigravity", "Antigravity"], ["v0", "V0"],
  ["slack", "Slack"], ["jira", "Jira"], ["lovable", "Lovable"],
  ["illustrator", "Illustrator"], ["aftereffects", "After Effects"], ["openai", "OpenAI"],
];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={sectionRef} id="skills" className="toolkit-section" aria-labelledby="toolkit-heading">
      <div className="toolkit-heading">
        <p className="font-[family-name:var(--font-handwriting)] text-xl text-zinc-500 sm:text-2xl">Tools I Use</p>
        <h2 id="toolkit-heading" className="mt-2 font-[family-name:var(--font-display)] text-[30px] font-extrabold leading-tight tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">What's in my toolkit</h2>
      </div>
      <div className="toolkit-window">
        <div className="toolkit-track" style={{ animationPlayState: visible && !paused ? "running" : "paused" }}>
          {[0, 1].map((copy) => (
            <ul key={copy} className="toolkit-set" aria-hidden={copy === 1 ? true : undefined}>
              {tools.map(([id, name]) => (
                <li key={id} className="toolkit-item">
                  <div className={`toolkit-tile toolkit-tile--${id}`}>
                    <img src={`/icons/${id}.svg`} alt="" width={48} height={48} loading="lazy" decoding="async" />
                  </div>
                  <span className="toolkit-label">{name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button type="button" className="toolkit-pause" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume animation" : "Pause animation"}</button>
    </section>
  );
}
export default Skills;
