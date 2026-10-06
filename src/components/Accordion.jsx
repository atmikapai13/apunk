import { useLayoutEffect, useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import styles from './Accordion.module.css'

export default function Accordion({ title, headingClassName = '', defaultOpen = true, noTopLine = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const Icon = open ? Minus : Plus
  const sectionRef = useRef(null)
  const toggleRef = useRef(null)

  // The lines start fading where the heading ends, so a longer title keeps its line solid for longer
  useLayoutEffect(() => {
    const section = sectionRef.current
    const toggle = toggleRef.current
    const update = () => section.style.setProperty('--fade-start', `${toggle.offsetWidth}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(toggle)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className={`${styles.section} ${noTopLine ? styles.noTopLine : ''}`}>
      <p className={headingClassName}>
        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          {title}
          <Icon size={14} strokeWidth={1.6} className={styles.icon} aria-hidden="true" />
        </button>
      </p>
      <div hidden={!open} className={styles.body}>{children}</div>
    </div>
  )
}
