import styles from './Contact.module.css'
import MobileHeader from '../components/MobileHeader'
import atmika from '../assets/atmika-scary.png'

export default function Contact() {
  return (
    <div>
      <MobileHeader page="contact" />
      <div className={styles.contactPhotoWrap}>
        <img src={atmika} alt="Atmika Pai" className={styles.contactPhoto} />
      </div>
      <p className={styles.contactText}>
        The beauty of living in New York City is that the density of people & ideas offers serendipitous encounters. 
        If you’re in NYC and want to chat, let's grab a coffee. If you prefer the virtual realm, book some time on my <a href="https://calendar.app.google/LgDoohMegwTQqQ3F9" target="_blank" rel="noreferrer">Google Calendar</a>.
        </p>
      <p className={styles.contactText}>
        = <a href="mailto:atmikapai13@gmail.com">atmikapai13 [at] gmail [.] com</a>
        <br></br>
         = <a href="https://www.linkedin.com/in/atmikapai/" target="_blank" rel="noreferrer">LinkedIn</a>
      
      <br></br>
        = <a href="https://x.com/ap131999" target="_blank" rel="noreferrer">Twitter</a>
      <br></br>
      
        = <a href="https://github.com/atmikapai13" target="_blank" rel="noreferrer">Github</a>
      <br></br>
       <br></br>
       = <a href="https://open.spotify.com/user/31dcr5jiqh7jasnjs6rulusj6oum" target="_blank" rel="noreferrer">Spotify</a>
      <br></br>

       = <a href="https://www.google.com/maps/contrib/118041312174586755892/reviews/@38.1141818,-114.9171383,4z/data=!3m1!4b1!4m3!8m2!3m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer">Google Maps (Local Guide Level 6)</a>
      <br></br>
      
      </p>
    </div>
  )
}
