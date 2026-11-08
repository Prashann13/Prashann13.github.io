import Section from '../components/Sections';
import ArcadeSlot from '../components/ArcadeSlot';
import { siteConfig } from '../data/siteConfig';
export default function PlayerArea() {
  return <Section id={siteConfig.playerArea.id} eyebrow={siteConfig.playerArea.eyebrow} title={siteConfig.playerArea.title} headingLevel="h2">
    <div className="player-area"><ArcadeSlot /></div>
  </Section>;
}
