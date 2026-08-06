import I18nText from "@/components/I18nText";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-[140px] max-w-6xl mx-auto px-6 py-16 text-white"
    >
      <h2 className="text-3xl md:text-4xl text-[#DCA900] text-center">
        <I18nText i18nKey="sections.contact.title" fallback="Contact Us" />
      </h2>
      <div className="mt-6 text-center text-white/90 space-y-2">
        <p>
          📞{" "}
          <a className="underline" href="tel:0876579546">
            087-657-9546
          </a>
          <span className="mx-2">|</span>
          <a className="underline" href="tel:053247661">
            053-247-661
          </a>
        </p>
        <p>
          ✉️{" "}
          <a className="underline" href="mailto:pawinee.qa@gmail.com">
            pawinee.qa@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
