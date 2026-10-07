import { useContext, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { AccordionGroupContext } from './AccordionGroup'
import styles from './Accordion.module.css'

const STORAGE_PREFIX = 'accordion-open:'

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
    <div className={styles.section}>
      <p className={styles.heading}>
        <button type="button" className={styles.toggle} aria-expanded={open} onClick={toggle}>
          <span className={styles.label}>{title}</span>
          {teaser && !open && <span className={styles.teaser}>({teaser})</span>}
          <Icon size={14} strokeWidth={1.6} className={styles.icon} aria-hidden="true" />
        </button>
      </p>
      <div hidden={!open} className={styles.body}>{children}</div>
    </div>
  )
}
