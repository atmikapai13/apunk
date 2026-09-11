import styles from './Home.module.css'
import MobileHeader from '../components/MobileHeader'
import atmika from '../assets/atmika-scary.png'

export default function Contact() {
  return (
    <div>
      <MobileHeader title="Contact" subtitle="coffee and chitchat" />
      <div className={styles.contactPhotoWrap}>
        <img src={atmika} alt="Atmika Pai" className={styles.contactPhoto} />
      </div>
      <p className={styles.contactText}>
        The beauty of living in New York City is that the density of people and ideas offers serendipitous encounters. So, if you’re in NYC, I’m happy to grab a coffee — shoot me an email. If you prefer the virtual realm, book some time on my <a href="https://calendar.app.google/LgDoohMegwTQqQ3F9" target="_blank" rel="noreferrer">GCal</a>.
        </p>
      <p className={styles.contactText}>
        = <a href="mailto:atmikapai13@gmail.com">atmikapai13 [at] gmail [.] com</a>
        <br></br>
         = <a href="https://www.linkedin.com/in/atmikapai/" target="_blank" rel="noreferrer">LinkedIn</a>
      <br></br>
      <br></br>
        = <a href="https://x.com/ap131999" target="_blank" rel="noreferrer">Twitter</a>
      <br></br>
      
        = <a href="https://github.com/atmikapai13" target="_blank" rel="noreferrer">Github</a>
      <br></br>
       
       = <a href="https://open.spotify.com/user/31dcr5jiqh7jasnjs6rulusj6oum" target="_blank" rel="noreferrer">Spotify</a>
      <br></br>
      
      </p>
    </div>
  )
}
