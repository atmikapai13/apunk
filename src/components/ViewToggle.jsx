import { Link } from 'react-router-dom'
import styles from './ViewToggle.module.css'

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
      <rect x="0" y="0" width="6.2" height="6.2" rx="1.2" />
      <rect x="8.8" y="0" width="6.2" height="6.2" rx="1.2" />
      <rect x="0" y="8.8" width="6.2" height="6.2" rx="1.2" />
      <rect x="8.8" y="8.8" width="6.2" height="6.2" rx="1.2" />
    </svg>
  )
}

function GalleryIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor">
      <rect x="0" y="0" width="16" height="8.5" rx="1.2" />
      <rect x="0" y="10" width="3.2" height="4" rx="0.8" />
      <rect x="4.2" y="10" width="3.2" height="4" rx="0.8" />
      <rect x="8.4" y="10" width="3.2" height="4" rx="0.8" />
      <rect x="12.8" y="10" width="3.2" height="4" rx="0.8" />
    </svg>
  )
}

export default function ViewToggle({ current }) {
  return (
    <div className={styles.toggle}>
      <Link
        to="/projects-grid"
        className={`${styles.btn} ${current === 'grid' ? styles.active : ''}`}
        title="Card view"
      >
        <GridIcon />
      </Link>
      <Link
        to="/projects-carousel"
        className={`${styles.btn} ${current === 'gallery' ? styles.active : ''}`}
        title="Gallery view"
      >
        <GalleryIcon />
      </Link>
    </div>
  )
}
