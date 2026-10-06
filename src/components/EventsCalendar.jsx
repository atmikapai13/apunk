import { ArrowUpRight } from 'lucide-react'
import Accordion from './Accordion'
import events from '../data/events.json'
import styles from '../pages/Home.module.css'

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

function eventsInMonth(now) {
  return events
    .filter(e => {
      const { y, m } = parseDay(e.start)
      return y === now.getFullYear() && m === now.getMonth()
    })
    .sort((a, b) => a.start.localeCompare(b.start))
}

// The collapsed heading hints at what's coming: the first event that hasn't finished yet, with the title cut
// at its first colon (e.g. "AI with Presence: The Choreography…" becomes "AI with Presence").
function nextEventTeaser(monthEvents, now) {
  const pad = n => String(n).padStart(2, '0')
  const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const next = monthEvents.find(e => (e.end || e.start).slice(0, 10) >= todayIso)
  return next ? `${formatRange(next.start, next.end)}: ${next.title.split(':')[0]}` : null
}

export default function EventsCalendar() {
  // Worked out on every render, so the month, the event list and the "next" teaser always follow today's date
  const now = new Date()
  const monthEvents = eventsInMonth(now)
  const teaser = nextEventTeaser(monthEvents, now)

  return (
      <div className={`${styles.contactText} ${styles.calendar}`}>
        <Accordion id="calendar" teaser={teaser} title={`My calendar for ${now.toLocaleString('en-US', { month: 'long' })}`}>
        <p className={styles.calendarIntro}>
          I'm experimenting with something new here, availed by consumer agents and coding on the fly. Each week, my <a href="https://instinct.com/" target="_blank" rel="noreferrer">Instinct agent</a> pulls events from my calendar, I review its picks, and it deploys them to my website. For this, it has access to both my Google Calendar and GitHub. 
        </p>
        <p className={styles.calendarIntro}>
          Long story short, here's what I will be up to in {now.toLocaleString('en-US', { month: 'long' })}, so feel free to join me:
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
        </Accordion>
      </div>
  )
}
