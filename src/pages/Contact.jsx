import styles from './Home.module.css'

export default function Contact() {
  return (
    <p className={styles.contactText}>
      You can share your ideas with me at <a href="mailto:atmikapai13@gmail.com">atmikapai13 [at] gmail [.] com</a>, and find other musings on <a href="https://x.com/ap131999" target="_blank" rel="noreferrer">X</a>.
    </p>
  )
}
