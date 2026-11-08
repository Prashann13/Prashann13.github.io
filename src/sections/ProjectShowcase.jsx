import Section from '../components/Sections';
import { content } from '../data/content';
export default function ProjectShowcase({ children }) {
  return <Section {...content.projects}>{children}</Section>;
}