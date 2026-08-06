import { ArrowUpRight } from 'lucide-react'
import styles from './Home.module.css'
import atmika from '../assets/atmika.png'
import INFLUENCES from '../data/sidebar-influences.json'

const ONGOINGS = [
  { title: 'The Periphery Center', href: 'https://peripherycenter.com/' },
  { title: 'NYC Eats', href: 'https://nyceats.live/' }
]

function OngoingList({ items }) {
  return (
    <div className={styles.ongoingList}>
      {items.map(({ title, href }) => (
        <div key={title} className={styles.projectItem}>
          <a href={href} target="_blank" rel="noreferrer">
            <span className={styles.projectContent}>
              <ArrowUpRight size={14} strokeWidth={2.1} />{title}
            </span>
          </a>
        </div>
      ))}
    </div>
  )
}

/* heart animation — commented out
function makeHeartPath() { ... }
function HeartDot({ delay }) { ... }
function AnimatedName() { ... }
*/

export default function Home() {
  return (
    <div className={styles.topRow}>
      <main className={styles.center}>
        <div className={styles.photoWrap}>
          <img src={atmika} alt="Atmika Pai" className={styles.photo} />
        </div>

        <div className={styles.bio}>
          <p>
            Welcome to Atmika Pai's website.
          </p>
          <p>By way of introduction, I earned my bachelor's degree in data science and economics from <a href="" target="_blank" rel="noreferrer">UC Berkeley</a> and master's degree in information science and urban technology from <a href="https://tech.cornell.edu/programs/masters-programs/jacobs-technion-cornell-dual-ms-urban-tech/" target="_blank" rel="noreferrer">Cornell Tech</a>.</p>
          <p>
            I worked briefly at <a href="" target="_blank" rel="noreferrer">AAA Insurance</a>, followed by short stints at startups building bespoke geospatial applications. Now, I'm at <a href="https://www.tcs.com/what-we-do/industries/capital-markets" target="_blank" rel="noreferrer">Tata Consultancy Services</a>, learning the inner machinations of a multinational corporation from the purview of an AI engineer.
          </p>
          <p>
            I like to build applications that 1) <a href="https://nyceats.live/spring2026/" target="_blank" rel="noreferrer">fill everyday life with whimsy and jest</a> 2) <a href="https://nyceats.live/worldcup2026/" target="_blank" rel="noreferrer">for my friends or local neighbourhood</a> or 3) <a href="https://atmikapai13.github.io/textmenot/" target="_blank" rel="noreferrer">lampoon our algorithmized, hyperreal digital life</a>. This typically takes the form of spatial or creative software.
          </p>
        </div>

        <div id="projects">
          <p className={styles.sectionLabel}>Ongoing works:</p>
          <OngoingList items={ONGOINGS} />
        </div>
      </main>

      <aside className={styles.right}>
        {INFLUENCES.map((group, gi) => (
          <div key={gi} className={styles.influenceGroup}>
            {group.map(({ name, url }, ni) => (
              <p key={`${gi}-${ni}`} className={styles.influence}>
                {url
                  ? <a href={url} target="_blank" rel="noreferrer">{name}</a>
                  : name}
              </p>
            ))}
          </div>
        ))}
      </aside>
    </div>
  )
}
