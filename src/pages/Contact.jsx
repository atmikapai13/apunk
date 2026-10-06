import styles from './Home.module.css'
import MobileHeader from '../components/MobileHeader'
import atmika from '../assets/atmika-scary.png'
import { ArrowUpRight } from 'lucide-react'
import events from '../data/events.json'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Dates are read from the ISO string directly to avoid timezone shifts
function parseDay(iso) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return { y, m: m - 1, d }
}

function formatRange(start, end) {
  const a = parseDay(start)
  const b = parseDay(end)
  const first = `${MONTHS[a.m]} ${a.d}`
  if (a.m === b.m && a.d === b.d) return first
  return a.m === b.m ? `${first}–${b.d}` : `${first}–${MONTHS[b.m]} ${b.d}`
}

const now = new Date()
const monthEvents = events
  .filter(e => {
    const { y, m } = parseDay(e.start)
    return y === now.getFullYear() && m === now.getMonth()
  })
  .sort((a, b) => a.start.localeCompare(b.start))

export default function Contact() {
  return (
    <div>
      <MobileHeader title="Contact" subtitle="coffee and chitchat" />
      <div className={styles.contactPhotoWrap}>
        <img src={atmika} alt="Atmika Pai" className={styles.contactPhoto} />
      </div>
      <p className={styles.contactText}>
        The beauty of living in New York City is that the density of people & ideas offers serendipitous encounters. 
        If you’re in NYC and want to chat, let's grab a coffee. If you prefer the virtual realm, book some time on my <a href="https://calendar.app.google/LgDoohMegwTQqQ3F9" target="_blank" rel="noreferrer">GCal</a>.
        </p>
      <div className={`${styles.contactText} ${styles.calendar}`}>
        <p className={styles.contactHeading}>My calendar for {now.toLocaleString('en-US', { month: 'long' })}</p>
        <p className={styles.calendarIntro}>
          I'm experimenting with something new here, availed by consumer agents and coding on the fly. My <a href="https://instinct.com/" target="_blank" rel="noreferrer">Instinct agent</a> updates
          these events every week by pulling from my calendar, which it has access to, and I supervise its
          picks. All of that is to say, come join me at any of these events.
        </p>
        <ul className={styles.eventList}>
          {monthEvents.map(e => (
            <li key={e.title + e.start}>
              <span className={styles.eventDate}>{formatRange(e.start, e.end)}</span>
              <span className={styles.eventBody}>
                {e.url ? (
                  <a href={e.url} target="_blank" rel="noreferrer">
                    {e.title}
                    <ArrowUpRight size={14} strokeWidth={2.1} className={styles.eventArrow} />
                  </a>
                ) : e.title}
                {e.note && <span className={styles.eventNote}>{e.note}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className={styles.contactHeading}>Socials</p>
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
