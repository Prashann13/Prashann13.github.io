import PlayerArea from '../sections/PlayerArea';
import { useRef } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Timeline from '../sections/Timeline';
import usePageTitle from '../hooks/usePageTitle';
import useScrollMotion from '../hooks/useScrollMotion';
import { navigation } from '../data/siteConfig';
export default function Home() { const ref = useRef(null); usePageTitle(navigation[0].label); useScrollMotion(ref); return <div ref={ref}><Hero /><About /><PlayerArea /><Timeline /></div>; }
