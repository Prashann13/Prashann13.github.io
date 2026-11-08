export default function Section({ eyebrow, title, description, headingLevel = 'h1', id, children, className = '' }) {
 const Heading = headingLevel;
 return <section id={id} className={'section shell ' + className}><div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><Heading data-heading>{title}</Heading></div>{description && <p className="section-description" data-reveal>{description}</p>}</div>{children}</section>;
}