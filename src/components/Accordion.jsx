import { useLayoutEffect, useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import styles from './Accordion.module.css'

const STORAGE_PREFIX = 'accordion-open:'

// Must match the icon size below and the button's gap in Accordion.module.css (used to place the line fade)
const ICON_SIZE = 14
const ICON_GAP = 6

// A visitor's choice is remembered per accordion; until they make one, `fallback` applies.
// localStorage can be unavailable (private windows, blocked storage), so every access is guarded.
function readOpen(id, fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + id)
    return saved === null ? fallback : saved === '1'
  } catch {
    return fallback
  }
}

function saveOpen(id, open) {
  try {
    localStorage.setItem(STORAGE_PREFIX + id, open ? '1' : '0')
  } catch {
    // ignore: the accordion still works, it just won't be remembered
  }
}

export default function Accordion({ id, title, teaser, defaultOpen = true, noTopLine = false, children }) {
  const [open, setOpen] = useState(() => readOpen(id, defaultOpen))
  const Icon = open ? Minus : Plus
  const sectionRef = useRef(null)
  const labelRef = useRef(null)

  // The lines start fading where the heading (title and icon) ends, so a longer title keeps its line solid for longer.
  // The teaser isn't counted, so the fade doesn't move when it appears.
  useLayoutEffect(() => {
    const section = sectionRef.current
    const label = labelRef.current
    const update = () => section.style.setProperty('--fade-start', `${label.offsetWidth + ICON_GAP + ICON_SIZE}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(label)
    return () => observer.disconnect()
  }, [])

  const toggle = () => {
    const next = !open
    setOpen(next)
    saveOpen(id, next)
  }

  return (
    <div ref={sectionRef} className={`${styles.section} ${noTopLine ? styles.noTopLine : ''}`}>
      <p className={styles.heading}>
        <button type="button" className={styles.toggle} aria-expanded={open} onClick={toggle}>
          <span ref={labelRef} className={styles.label}>{title}</span>
          {teaser && !open && <span className={styles.teaser}>({teaser})</span>}
          <Icon size={ICON_SIZE} strokeWidth={1.6} className={styles.icon} aria-hidden="true" />
        </button>
      </p>
      <div hidden={!open} className={styles.body}>{children}</div>
    </div>
  )
}
