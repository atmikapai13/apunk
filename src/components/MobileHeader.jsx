import styles from './MobileHeader.module.css'

// All mobile page headers live here: edit the title or subtitle text for any page below.
const HEADERS = {
  writing: { title: 'Writing', subtitle: 'Essays, white papers, and musings' },
  portfolio: { title: 'Portfolio', subtitle: 'Spatial and creative software' },
  contact: { title: 'Contact', subtitle: 'Coffee and chitchat' },
}

export default function MobileHeader({ page }) {
  const { title, subtitle } = HEADERS[page]
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  )
}
