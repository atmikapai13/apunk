import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { AccordionGroupContext } from './AccordionGroup'
import styles from './Accordion.module.css'

const STORAGE_PREFIX = 'accordion-open:'

// Must match the icon size below and the button's gap in Accordion.module.css (used to place the line fade)
const ICON_SIZE = 14
const ICON_GAP = 6

// The separator line is solid under the heading, then fades out. Both are fractions of the heading's width,
// so every line keeps the same shape at its own scale (the calendar's looks right, the others match it).
//   FADE_START_RATIO: where the fade starts. 1 is the end of the heading, 0.5 is halfway along it.
//   FADE_LENGTH_RATIO: how long the fade is. Smaller is a tighter fade.
const FADE_START_RATIO = 1
const FADE_LENGTH_RATIO = 1.15

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

export default function Accordion({ id, title, teaser, defaultOpen = true, children }) {
  // Inside an AccordionGroup the group decides which one is open; on its own it keeps (and remembers) its own state
  const group = useContext(AccordionGroupContext)
  const [ownOpen, setOwnOpen] = useState(() => readOpen(id, defaultOpen))
  const open = group ? group.openId === id : ownOpen
  const Icon = open ? Minus : Plus
  const sectionRef = useRef(null)
  const labelRef = useRef(null)

  // Each line starts fading in proportion to its own heading (title and icon), so a longer title keeps its line solid
  // for longer. The teaser isn't counted, so the fade doesn't move when it appears.
  useLayoutEffect(() => {
    const section = sectionRef.current
    const label = labelRef.current
    const update = () => {
      const headingWidth = label.offsetWidth + ICON_GAP + ICON_SIZE
      section.style.setProperty('--fade-start', `${Math.round(headingWidth * FADE_START_RATIO)}px`)
      section.style.setProperty('--fade-length', `${Math.round(headingWidth * FADE_LENGTH_RATIO)}px`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(label)
    return () => observer.disconnect()
  }, [])

  const toggle = () => {
    if (group) {
      group.toggle(id)
      return
    }
    const next = !open
    setOwnOpen(next)
    saveOpen(id, next)
  }

  return (
    <div ref={sectionRef} className={styles.section}>
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
