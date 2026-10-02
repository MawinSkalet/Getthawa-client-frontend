
import SiteText from "@/components/SiteText";


export function ContactSection() {
  return <footer id="contact" className="contact-section">
    <h2 translate="no">Contact Us</h2>
    <div className="contact-columns">
      <p><SiteText text={"Your moment of relaxation awaits."} /><br /><SiteText text={"Step into Getthawha and experience the beauty of traditional Thai wellness."} /></p>
      <address>
        <p><SiteText text={"📍 Rimping, Chiang Mai"} /></p>
        <p><a href="tel:0876579546">087-657-9546</a> / <a href="tel:053247661">053-247-661</a></p>
        <p><a href="mailto:pawinee.qa@gmail.com">pawinee.qa@gmail.com</a></p>
      </address>
    </div>
    <small>© {new Date().getFullYear()} Getthawha Thai Massage</small>
  </footer>;
}
