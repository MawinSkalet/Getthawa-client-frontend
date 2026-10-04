export default function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return <div className="section-heading" translate="no"><h2 id={id}>{children}</h2><span aria-hidden="true">✦</span></div>;
}
