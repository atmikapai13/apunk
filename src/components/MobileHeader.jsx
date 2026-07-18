import styles from './MobileHeader.module.css'

export default function MobileHeader({ title, subtitle }) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  )
}
