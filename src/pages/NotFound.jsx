import { Link } from 'react-router';
import Section from '../components/Sections';
import { content } from '../data/content';
import { siteConfig } from '../data/siteConfig';
import usePageTitle from '../hooks/usePageTitle';
export default function NotFound() { usePageTitle(content.notFound.title); return <Section {...content.notFound}><Link to={siteConfig.routes.home} className="hud-button">{content.notFound.return} ↗</Link></Section>; }