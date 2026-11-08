import { useEffect } from 'react';
import { siteConfig } from '../data/siteConfig';
export default function usePageTitle(title) {
 useEffect(() => { document.title = title + ' | ' + siteConfig.title; }, [title]);
}