"use client";

import * as React from "react";

const links = ["What we do", "Projects", "Events", "Team", "GitHub"];

function Sparkle({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 40 40" className={className} aria-hidden="true"><path d="M20 3l3.4 13.6L37 20l-13.6 3.4L20 37l-3.4-13.6L3 20l13.6-3.4z" fill="white" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /></svg>;
}

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function Github() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.4 6.4-1.5 6.4-6.9a5.4 5.4 0 0 0-1.5-3.7 5 5 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.3 1.3 5.1 1.7 5.1 1.7a5 5 0 0 0-.1 3.7A5.4 5.4 0 0 0 3.5 9c0 5.4 3.3 6.5 6.4 6.9a3.4 3.4 0 0 0-.9 2.6V22" /></svg>;
}

export default function DoodleCrewFooter() {
  const repeated = ["Ideas", "People", "Projects", "Impact", "DevCatalyst"];

  return (
    <footer id="footer" className="relative w-full overflow-hidden border-t border-[#e6e6e6] bg-white px-0 pt-[clamp(110px,15vh,180px)] text-[#0f0f0f]">
      <div className="pointer-events-none absolute left-[4vw] top-12 hidden border-l border-black pl-4 font-mono text-[11px] uppercase leading-[2.1] tracking-[0.3em] lg:block">Student led<br />Tech<br />Community</div>
      <div className="pointer-events-none absolute right-[4vw] top-12 hidden font-mono text-[11px] uppercase leading-[2.1] tracking-[0.3em] lg:block"><Sparkle className="mb-2 block w-4" />Ideas<br />People<br />Projects<br />Impact<span className="mt-2 block h-px w-11 -rotate-2 bg-black" /></div>

      <div className="relative mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-[4vw]">
        <div className="relative mx-auto w-full max-w-[1280px]">
          <Sparkle className="absolute -left-1 top-[-9%] w-[clamp(26px,3vw,44px)] text-black [filter:drop-shadow(3px_3px_0_#0f0f0f)]" />
          <Sparkle className="absolute -right-1 top-[-16%] w-[clamp(40px,4.6vw,68px)] text-black [filter:drop-shadow(3px_3px_0_#0f0f0f)]" />
          <p className="mb-[4vh] text-center font-mono text-[12px] uppercase tracking-[0.35em] before:mr-4 before:inline-block before:h-[34px] before:w-px before:translate-y-[-2px] before:bg-black before:align-middle">Curious minds — Real projects</p>
          <div className="overflow-hidden px-[.1em]">
            <h2 className="flex select-none justify-center whitespace-nowrap text-[clamp(58px,12.5vw,215px)] font-black leading-none tracking-[-.065em] [filter:url(#dc-footer-rough)]" aria-label="DevCatalyst">
              {Array.from("DevCatalyst").map((char, index) => <span key={`${char}-${index}`} className="dc-footer-letter inline-block bg-black bg-[radial-gradient(#fff9_0.8px,transparent_1px),linear-gradient(transparent_45%,#fff4_46%,transparent_49%)] bg-[length:18px_18px,100%_100%] bg-clip-text text-transparent">{char}</span>)}
            </h2>
          </div>
          <svg className="dc-footer-scribble pointer-events-none absolute -bottom-[7%] left-[1%] h-[34px] w-[98%]" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M12 34C180 18 360 44 540 30S880 22 988 32" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /><path d="M20 44C200 32 420 50 620 38S900 32 978 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".4" /></svg>
        </div>

        <h3 className="mt-[clamp(56px,8vh,90px)] text-center text-[clamp(20px,2.6vw,36px)] font-black tracking-[-.035em]">Build beyond <span className="text-[#8a8a8a]">the syllabus.</span></h3>
        <div className="mt-[30px] flex flex-wrap justify-center gap-[14px] px-[4vw]">
          <a href="#contact" className="flex items-center gap-2.5 rounded-full bg-[#0f0f0f] px-[30px] py-[15px] text-base font-medium text-white transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#a3a3a3]">Join DevCatalyst <Arrow /></a>
          <a href="#gallery" className="flex items-center gap-2.5 rounded-full border-[1.5px] border-[#0f0f0f] px-[30px] py-[15px] text-base font-medium transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0f0f0f]"><Github /> Explore Projects</a>
        </div>

        <div className="dc-footer-marquee mt-[clamp(70px,10vh,110px)] overflow-hidden border-y border-black py-[clamp(10px,1.6vw,20px)]">
          <div className="dc-footer-track flex w-max">
            {[0, 1].map((copy) => <div key={copy} className="flex items-center gap-[3.2vw] pr-[3.2vw] text-[clamp(36px,5.6vw,92px)] font-black uppercase leading-none tracking-[-.03em]" aria-hidden={copy === 1}>{repeated.map((item, index) => <React.Fragment key={`${copy}-${item}`}><span className={index % 2 ? "dc-footer-outline" : ""}>{item}</span><Sparkle className="w-[.42em] shrink-0 text-black" /></React.Fragment>)}</div>)}
          </div>
        </div>
      </div>

      <div className="mt-0 flex flex-wrap items-center justify-between gap-[18px] border-t border-[#e6e6e6] px-[4vw] py-6 font-mono text-[11px] uppercase tracking-[0.25em] text-[#555]">
        <span>© 2025 DevCatalyst</span>
        <nav className="flex flex-wrap gap-x-[26px] gap-y-2">{links.map((link) => <a key={link} href="#" className="transition-colors hover:text-black hover:underline">{link}</a>)}</nav>
        <span>Made on campus</span>
      </div>
      <svg width="0" height="0" className="absolute"><defs><filter id="dc-footer-rough"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="4" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" /></filter></defs></svg>
      <style>{`@keyframes dcFooterMarquee{to{transform:translateX(-50%)}}@keyframes dcFooterRise{0%{opacity:0;transform:translateY(115%) rotate(-5deg)}65%{opacity:1;transform:translateY(-5%) rotate(0)}100%{opacity:1;transform:none}}@keyframes dcFooterDraw{to{stroke-dashoffset:0}}@keyframes dcFooterFade{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}.dc-footer-track{animation:dcFooterMarquee 28s linear infinite}.dc-footer-letter{transform-origin:50% 100%;animation:dcFooterRise .95s cubic-bezier(.2,.85,.25,1.15) both}.dc-footer-letter:nth-child(2n){animation-delay:55ms}.dc-footer-letter:nth-child(3n){animation-delay:110ms}.dc-footer-letter:nth-child(4n){animation-delay:165ms}.dc-footer-scribble path{stroke-dasharray:1100;stroke-dashoffset:1100;animation:dcFooterDraw 1.3s ease-out .7s forwards}.dc-footer-scribble path+path{animation-delay:.85s}.dc-footer-marquee{animation:dcFooterFade .8s ease-out 1.25s both}.dc-footer-outline{-webkit-text-stroke:1.5px #0f0f0f;color:transparent}@media(prefers-reduced-motion:reduce){.dc-footer-track{animation-play-state:paused}.dc-footer-letter,.dc-footer-scribble path,.dc-footer-marquee{animation:none!important}.dc-footer-scribble path{stroke-dashoffset:0}}`}</style>
    </footer>
  );
}
