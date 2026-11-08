import { useRef } from 'react';
import ContactSection from '../sections/ContactSection';
import usePageTitle from '../hooks/usePageTitle';
import useScrollMotion from '../hooks/useScrollMotion';
import { content } from '../data/content';
export default function Contact() { const ref = useRef(null); usePageTitle(content.contact.title); useScrollMotion(ref); return <div ref={ref}><ContactSection /></div>; }