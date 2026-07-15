import { Link } from 'react-router-dom'
import SidebarIdentity from './SidebarIdentity'
import styles from './Sidebar.module.css'

export default function Sidebar({ active }) {
  return (
    <aside className={styles.left}>
      <SidebarIdentity />
      <nav className={styles.nav}>
        <Link to="/projects-grid" className={`${styles.navLink} ${active === 'projects' ? styles.navActive : ''}`}>Portfolio</Link>
        <Link to="/writing" className={`${styles.navLink} ${active === 'writing' ? styles.navActive : ''}`}>Writing</Link>
        <Link to="/contact" className={`${styles.navLink} ${active === 'contact' ? styles.navActive : ''}`}>Contact</Link>
      </nav>
    </aside>
  )
}
