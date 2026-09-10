import styles from './Home.module.css'
import MobileHeader from '../components/MobileHeader'
import atmika from '../assets/atmika-scary.png'

export default function Contact() {
  return (
    <div>
      <MobileHeader title="Contact" subtitle="tea and chatter" />
      <div className={styles.contactPhotoWrap}>
        <img src={atmika} alt="Atmika Pai" className={styles.contactPhoto} />
      </div>
      <p className={styles.contactText}>
        You can share your ideas with me at <a href="mailto:atmikapai13@gmail.com">atmikapai13 [at] gmail [.] com</a>, and find other musings on <a href="https://x.com/ap131999" target="_blank" rel="noreferrer">X</a>.
      </p>
      <p className={styles.contactText}>
        If you're not in NYC, still happy to chat! Book some time on my <a href="https://calendar.app.google/LgDoohMegwTQqQ3F9" target="_blank" rel="noreferrer">GCal</a>.
      </p>
      <p className={styles.contactText}>
        My code lives and breathes on <a href="https://github.com/atmikapai13" target="_blank" rel="noreferrer">Github</a>.
      </p>
    </div>
  )
}
