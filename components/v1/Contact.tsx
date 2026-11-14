"use client";

import React, { useState } from "react";
import { ArrowUpRight, Send, Copy, Check } from "lucide-react";
import { FaInstagram, FaBehance, FaLinkedin } from "react-icons/fa6";

const socials = [
  { name: "Instagram", href: "https://www.instagram.com/moeezdesigns/", Icon: FaInstagram },
  { name: "Behance", href: "https://www.behance.net/moiztahir36", Icon: FaBehance },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/moiz-tahir-44266128a/", Icon: FaLinkedin },
];

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    if (!endpoint || !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
      setStatus("error");
      setNotice("The form is temporarily unavailable. Please use the email or social links below. Your message has not been sent.");
      return;
    }
    setStatus("sending");
    setNotice("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("Unable to send");
      setStatus("success");
      setNotice("Thanks for reaching out! Your message has been sent.");
      form.reset();
    } catch {
      setStatus("error");
      setNotice("We couldn't confirm delivery. Your message is still here—please try again or use the email below.");
    }
  }

  async function copyEmail() {
    try { await navigator.clipboard.writeText("iammoeez@gmail.com"); setCopied(true); }
    catch { setNotice("You can select and copy iammoeez@gmail.com below."); }
  }

  const fieldClass = "mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 text-base text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white";
  return (
    <footer id="contact" className="relative bg-[#0F0F0F] px-6 py-16 text-white sm:px-12 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="font-[family-name:var(--font-handwriting)] text-2xl text-zinc-400">Get in Touch</p>
            <h2 className="mt-3 max-w-xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Let's build something beautiful together.</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">Have a project in mind? Tell me what you're working on and how I can help.</p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <a className="break-all py-3 text-base font-medium underline decoration-zinc-700 underline-offset-4 hover:decoration-white sm:text-xl" href="mailto:iammoeez@gmail.com">iammoeez@gmail.com</a>
              <button type="button" onClick={copyEmail} aria-label={copied ? "Email copied" : "Copy email address"} className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 hover:bg-zinc-800">{copied ? <Check size={18}/> : <Copy size={18}/>}</button>
              <span className="text-sm text-zinc-400" aria-live="polite">{copied ? "Copied" : ""}</span>
            </div>
            <a href="tel:+923044247985" className="inline-flex min-h-11 items-center text-zinc-400 hover:text-white">+92 304 4247985</a>
          </div>
          <form onSubmit={submit} className="rounded-2xl border border-zinc-800 bg-white/[0.02] p-5 sm:p-8" aria-label="Project enquiry" aria-busy={status === "sending"}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium" htmlFor="contact-name">Your name<input className={fieldClass} id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder="Your name" /></label>
              <label className="text-sm font-medium" htmlFor="contact-email">Email address<input className={fieldClass} id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
            </div>
            <label className="mt-5 block text-sm font-medium" htmlFor="contact-message">Tell me about your project<textarea className={`${fieldClass} min-h-40 resize-y`} id="contact-message" name="message" required minLength={10} maxLength={5000} placeholder="What are you building, and what do you need help with?" /></label>
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <button disabled={status === "sending"} className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-60" type="submit">{status === "sending" ? "Sending…" : "Send message"}<Send size={18}/></button>
            <p className={`mt-4 text-sm leading-relaxed ${status === "error" ? "text-amber-200" : "text-zinc-300"}`} role="status" aria-live="polite">{notice}</p>
          </form>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 border-t border-zinc-800 pt-8 sm:flex sm:flex-wrap sm:justify-center sm:gap-8">
          {socials.map(({ name, href, Icon }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-zinc-800 px-3 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white sm:border-0"><Icon aria-hidden="true" size={21}/>{name}<ArrowUpRight size={14}/></a>)}
          <a href="https://arc.dev/@moiztahir" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-zinc-800 px-3 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white sm:border-0"><img src="/icons/arc.png" alt="" width={24} height={24} className="rounded"/>Arc.dev<ArrowUpRight size={14}/></a>
        </div>
        <p className="mt-10 text-center text-xs leading-relaxed text-zinc-500">© {new Date().getFullYear()} Moiz Tahir. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Contact;
