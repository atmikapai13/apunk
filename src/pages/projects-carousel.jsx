import { useState, useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import styles from './projects-carousel.module.css'
import ViewToggle from '../components/ViewToggle'
import PROJECTS_DATA from '../data/projects.json'
import nycEatsGif from '../assets/projects/nyceats.gif'
import nycAlgoMatcherGif from '../assets/projects/nyc-algomatcher.gif'
import peripheryCenterGif from '../assets/projects/periphery-center.gif'
import keepingItUrbanGif from '../assets/projects/keeping-it-urban.gif'
import agentMonGif from '../assets/projects/agent-mon.gif'
import algoMatcherPng from '../assets/projects/algo-matcher.png'
import agentMonPng from '../assets/projects/agent-mon.png'
import juliusAIAtlasGif from '../assets/projects/juliusAIAtlas.gif'
import textmenotLongGif from '../assets/projects/textmenot-long.gif'
import nycracesGif from '../assets/projects/nycraces.gif'

const MEDIA = {
  peripheryCenter: peripheryCenterGif,
  nycEats: nycEatsGif,
  keepingItUrban: keepingItUrbanGif,
  agentMon: agentMonGif,
  agentMonPng,
  nycAlgoMatcher: nycAlgoMatcherGif,
  algoMatcher: algoMatcherPng,
  juliusAIAtlas: juliusAIAtlasGif,
  textmenot: textmenotLongGif,
  nycraces: nycracesGif,
}

const PROJECTS = PROJECTS_DATA.map(p => ({
  ...p,
  media: MEDIA[p.mediaKey],
  thumbnail: MEDIA[p.thumbnailKey || p.mediaKey],
}))


const N = PROJECTS.length
const THUMB_W = 160
const THUMB_H = 100
const GAP = 16
const STEP = THUMB_W + GAP

const EXTENDED = [...PROJECTS, ...PROJECTS, ...PROJECTS]

function StaticThumb({ src }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (!src) return
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = THUMB_W
      canvas.height = THUMB_H
      const ctx = canvas.getContext('2d')
      const scale = Math.max(THUMB_W / img.naturalWidth, THUMB_H / img.naturalHeight)
      const sw = img.naturalWidth * scale
      const sh = img.naturalHeight * scale
      ctx.drawImage(img, (THUMB_W - sw) / 2, (THUMB_H - sh) / 2, sw, sh)
    }
    img.src = src
  }, [src])
  return <canvas ref={canvasRef} className={styles.thumbCanvas} />
}

export default function Projects2() {
  const [rawIndex, setRawIndex] = useState(N)
  const [animated, setAnimated] = useState(true)

  const activeProject = PROJECTS[rawIndex % N]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (dir) => {
    setAnimated(true)
    setRawIndex(i => i + dir)
  }

  useEffect(() => {
    if (!animated) return
    if (rawIndex < N || rawIndex >= 2 * N) {
      const t = setTimeout(() => {
        setAnimated(false)
        setRawIndex(r => ((r % N) + N) % N + N)
      }, 420)
      return () => clearTimeout(t)
    }
  }, [rawIndex, animated])

  useEffect(() => {
    if (!animated) {
      const t = setTimeout(() => setAnimated(true), 20)
      return () => clearTimeout(t)
    }
  }, [animated])

  return (
    <div className={styles.main}>
      <div className={styles.sticky}>

        <div className={styles.topBar}>
          <ViewToggle current="gallery" />
          </div>

          <div className={styles.info}>

            <span className={styles.tag}>{activeProject.tag}</span>
            <a
              href={activeProject.href}
              target="_blank"
              rel="noreferrer"
              className={styles.titleLink}
            >
              <h1 className={styles.title}>
                {activeProject.title.toUpperCase()}
                <ArrowUpRight size={40} strokeWidth={1.4} className={styles.titleArrow} />
              </h1>
            </a>
            <p className={styles.description}>{activeProject.description}</p>
            <div className={styles.mediaWrap}>
              {activeProject.video
                ? <iframe
                    key={activeProject.title}
                    src={activeProject.video}
                    className={styles.videoEmbed}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeProject.title}
                  />
                : activeProject.media
                  ? <img key={activeProject.title} src={activeProject.media} alt={activeProject.title} className={styles.media} />
                  : <div className={styles.mediaPlaceholder} />
              }
            </div>
          </div>

          <div className={styles.carouselSection}>
            <div className={styles.carouselViewport}>
              <div
                className={styles.carouselTrack}
                style={{
                  transform: `translateX(${-rawIndex * STEP}px)`,
                  transition: animated ? 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
                }}
              >
                {EXTENDED.map((p, i) => {
                  const dist = Math.abs(i - rawIndex)
                  const scale = Math.max(0.75, 1 - dist * 0.1)
                  const opacity = Math.max(0.2, 1 - dist * 0.28)
                  return (
                    <div
                      key={i}
                      className={`${styles.carouselItem} ${i === rawIndex ? styles.carouselItemActive : ''}`}
                      style={{ transform: `scale(${scale})`, opacity }}
                      onClick={() => {
                        setAnimated(true)
                        setRawIndex(i)
                      }}
                    >
                      {p.thumbnail
                        ? <StaticThumb src={p.thumbnail} />
                        : <div className={styles.thumbPlaceholder}>{p.title[0]}</div>
                      }
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

      </div>
    </div>
  )
}
