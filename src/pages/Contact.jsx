import styles from './Home.module.css'
import MobileHeader from '../components/MobileHeader'
import atmika from '../assets/atmika.png'

export default function Contact() {
  return (
    <div>
      <MobileHeader title="Contact" subtitle="Tea and chatter" />
      <div className={styles.contactPhotoWrap}>
        <img src={atmika} alt="Atmika Pai" className={styles.contactPhoto} />
      </div>
      <p className={styles.contactText}>
        You can share your ideas with me at <a href="mailto:atmikapai13@gmail.com">atmikapai13 [at] gmail [.] com</a>, and find other musings on <a href="https://x.com/ap131999" target="_blank" rel="noreferrer">X</a>.
      </p>
    </div>
  )
}
