import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { AnimatePresence, LayoutGroup, LazyMotion, m, MotionConfig, useIsPresent } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import MotionFoundation from './components/MotionFoundation';
import Preloader from './components/Preloader';
import { ui } from './data/content';
import { siteConfig } from './data/siteConfig';
const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const Blender = lazy(() => import('./pages/Blender'));
const BlenderDetail = lazy(() => import('./pages/BlenderDetail'));
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Skills = lazy(() => import('./pages/Skills'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const loadFeatures = () => import('./hooks/motionFeatures').then((module) => module.default);
function RouteTransition({ children }) {
 const present = useIsPresent();
 return <m.div inert={!present} className="route-transition" style={present ? undefined : { position: 'absolute', inset: '0 0 auto' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}>{children}</m.div>;
}
export default function App() {
 const location = useLocation();
 return <MotionConfig reducedMotion="never"><LazyMotion features={loadFeatures} strict>
  <div id="top" tabIndex={-1}><a href={siteConfig.sections.main} className="skip-link">{ui.skip}</a><Navbar /><ScrollToTop /><MotionFoundation /><Preloader />
   <main id="main" tabIndex={-1}>
    <LayoutGroup id="portfolio-routes"><AnimatePresence initial={false} mode="sync"><RouteTransition key={location.pathname}>
     <Suspense fallback={<div className="route-loading" role="status">{ui.loading}</div>}>
      <Routes location={location}>
       <Route path={siteConfig.routes.home} element={<Home />} /><Route path={siteConfig.routes.projects} element={<Projects />} />
       <Route path={siteConfig.routes.skills} element={<Skills />} /><Route path={siteConfig.routes.contact} element={<Contact />} />
       <Route path={siteConfig.routes.caseStudy} element={<CaseStudy />} /><Route path={siteConfig.routes.blender} element={<Blender />} /><Route path={siteConfig.routes.blenderDetail} element={<BlenderDetail />} /><Route path={siteConfig.routes.notFound} element={<NotFound />} />
      </Routes>
     </Suspense>
    </RouteTransition></AnimatePresence></LayoutGroup>
   </main><Footer />
  </div>
 </LazyMotion></MotionConfig>;
}
