import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import styles from './projects-grid.module.css'
import ViewToggle from '../components/ViewToggle'
import PROJECTS_DATA from '../data/projects.json'
import nycEatsGif from '../assets/projects/nyceats.gif'
import nycAlgoMatcherGif from '../assets/projects/nyc-algomatcher.gif'
import peripheryCenterGif from '../assets/projects/periphery-center.gif'
import keepingItUrbanGif from '../assets/projects/keeping-it-urban.gif'
import agentMonGif from '../assets/projects/agent-mon.gif'
import agentMonPng from '../assets/projects/agent-mon.png'
import algoMatcherPng from '../assets/projects/algo-matcher.png'
import juliusAIAtlasGif from '../assets/projects/juliusAIAtlas.gif'

const MEDIA = {
  peripheryCenter: peripheryCenterGif,
  nycEats: nycEatsGif,
  keepingItUrban: keepingItUrbanGif,
  agentMon: agentMonGif,
  agentMonPng,
  nycAlgoMatcher: nycAlgoMatcherGif,
  algoMatcher: algoMatcherPng,
  juliusAIAtlas: juliusAIAtlasGif,
}

const PROJECTS = PROJECTS_DATA.map(p => ({
  ...p,
  media: MEDIA[p.mediaKey],
  thumbnail: MEDIA[p.thumbnailKey || p.mediaKey],
}))


function ProjectCard({ title, description, tag, href, media }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        setHovered(true)
        if (media) document.body.classList.add('media-hover')
      }}
      onMouseLeave={() => { setHovered(false); if (media) document.body.classList.remove('media-hover') }}
    >
      {media && hovered && (
        <img
          src={media}
          alt=""
          aria-hidden="true"
          className={styles.cardMedia}
          style={{ left: pos.x, top: pos.y }}
        />
      )}
      <div className={styles.cardContent}>
        <span className={styles.tag}>{tag}</span>
        <h2 className={styles.title}>
          {title.toUpperCase()}
          <ArrowUpRight size={26} strokeWidth={1.6} className={styles.arrow} />
        </h2>
        <p className={styles.description}>{description}</p>
      </div>
    </a>
  )
}

export default function Projects() {
  return (
    <main className={styles.content}>
      <div className={styles.topBar}>
        <ViewToggle current="grid" />
      </div>
      <div className={styles.grid}>
        {PROJECTS.map((p) => (
          <ProjectCard key={p.title} {...p} />
        ))}
      </div>
    </main>
  )
}
