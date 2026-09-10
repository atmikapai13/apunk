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
        The beauty of living in New York City is that the density of people and ideas offers up serendipitous encounters. To that end, if you are in NYC, I'm always happy to grab coffee in Brooklyn, my abode. But, if you're not in NYC, book some time on my <a href="https://calendar.app.google/LgDoohMegwTQqQ3F9" target="_blank" rel="noreferrer">GCal</a>.
        </p>
      <p className={styles.contactText}>
        = <a href="mailto:atmikapai13@gmail.com">atmikapai13 [at] gmail [.] com</a>
        <br></br>
        = <a href="https://x.com/ap131999" target="_blank" rel="noreferrer">Twitter</a>
      <br></br>
        = <a href="https://github.com/atmikapai13" target="_blank" rel="noreferrer">Github</a>
      <br></br>
        = <a href="https://www.linkedin.com/in/atmikapai/" target="_blank" rel="noreferrer">LinkedIn</a>
      <br></br>
      </p>
    </div>
  )
}
