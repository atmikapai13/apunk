import { useEffect, useState } from 'react'
import styles from './StickyBand.module.css'

// A band of content pinned to the top of the window on desktop while the page scrolls underneath it, with a soft
// fade below it once the page has scrolled. Use it for the first block of a page, e.g. the Home photo or the Media
// intro note. Pass `className` for page-specific spacing.
export default function StickyBand({ className = '', children }) {
  // Once the page has scrolled the band is pinned, and the fade under it can show
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div className={`${styles.band} ${scrolled ? styles.scrolled : ''} ${className}`}>{children}</div>
}
