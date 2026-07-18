import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import SidebarIdentity from './SidebarIdentity'
import styles from './Sidebar.module.css'

export default function Sidebar({ active }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <button
        type="button"
        className={styles.mobileToggle}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        {open ? <X size={18} strokeWidth={1.8} /> : <Plus size={18} strokeWidth={1.8} />}
      </button>
      <aside className={`${styles.left} ${open ? styles.open : ''}`}>
        <SidebarIdentity onNavigate={close} />
        <nav className={styles.nav}>
          <Link to="/projects-grid" onClick={close} className={`${styles.navLink} ${active === 'projects' ? styles.navActive : ''}`}>Portfolio</Link>
          <Link to="/writing" onClick={close} className={`${styles.navLink} ${active === 'writing' ? styles.navActive : ''}`}>Writing</Link>
          <Link to="/contact" onClick={close} className={`${styles.navLink} ${active === 'contact' ? styles.navActive : ''}`}>Contact</Link>
        </nav>
      </aside>
    </>
  )
}
