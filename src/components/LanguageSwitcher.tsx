"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type Language } from "@/locales/i18n";
const choices: {code: Language; name: string; flag: string}[] = [
  {code:"th",name:"ไทย",flag:"th"}, {code:"zh",name:"中文",flag:"cn"}, {code:"en",name:"English",flag:"gb"}
];
export default function LanguageSwitcher({className = ""}: {variant?: "icon" | "button" | "label"; className?: string}) {
  const {i18n} = useTranslation();
  const [language,setLanguage] = useState("en");
  const [open,setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => setLanguage(i18n.resolvedLanguage || "en");
    update(); i18n.on("languageChanged",update);
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown",close);
    return () => { i18n.off("languageChanged",update); document.removeEventListener("pointerdown",close); };
  },[i18n]);
  const current = choices.find(choice => language.startsWith(choice.code)) || choices[2];
  return <div ref={root} className={"language-menu " + className} onKeyDown={event => { if(event.key === "Escape") setOpen(false); }}>
    <button className="language-trigger" aria-label={"Language: " + current.name} aria-expanded={open} onClick={() => setOpen(!open)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={"/flags/"+current.flag+".svg"} width="28" height="20" alt={current.name} /><span aria-hidden="true">⌄</span>
    </button>
    {open && <div className="language-options">
      {choices.map(choice => <button key={choice.code} lang={choice.code} aria-pressed={current.code===choice.code} onClick={async () => {
        await i18n.changeLanguage(choice.code); document.documentElement.lang = choice.code;
        document.cookie = "i18next="+choice.code+"; path=/; max-age=31536000; SameSite=Lax";
        setOpen(false);
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={"/flags/"+choice.flag+".svg"} width="28" height="20" alt="" />{choice.name}
      </button>)}
    </div>}
  </div>;
}
