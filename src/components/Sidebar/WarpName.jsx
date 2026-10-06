import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const MOBILE_QUERY = '(max-width: 900px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

// How fast the animation clock advances per frame, which sets how quickly the letters ripple.
// Desktop is a smooth, slow wave; hovering speeds up the same wave (no jumps). Mobile keeps the original
// lively pace with a flickering noise pattern. Edit these to change the pace.
const MOBILE_STEP = 0.018
const IDLE_STEP = MOBILE_STEP * 0.3     // desktop, not hovered
const HOVER_STEP = MOBILE_STEP * 2.5    // desktop, hovered
const DESKTOP_SEED = 7                  // fixed noise pattern for the smooth desktop waves

export default function WarpName() {
  const turbRef = useRef(null)
  const rafRef = useRef(null)
  const tRef = useRef(0)
  const [hovered, setHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches)
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia(REDUCED_MOTION_QUERY).matches)

  useEffect(() => {
    const sizeQuery = window.matchMedia(MOBILE_QUERY)
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    const onSizeChange = () => setIsMobile(sizeQuery.matches)
    const onMotionChange = () => setReduceMotion(motionQuery.matches)
    sizeQuery.addEventListener('change', onSizeChange)
    motionQuery.addEventListener('change', onMotionChange)
    return () => {
      sizeQuery.removeEventListener('change', onSizeChange)
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  // The name is in constant motion (blue and warping) on the landing page and on mobile.
  // On the other pages it only moves while hovered. Visitors who ask their system to reduce motion get none.
  const isHome = useLocation().pathname === '/'
  const active = !reduceMotion && (isMobile || isHome || hovered)
  const step = isMobile ? MOBILE_STEP : hovered ? HOVER_STEP : IDLE_STEP

  useEffect(() => {
    if (active) {
      // Changing the seed makes the noise jump to a new shape. Mobile re-rolls it every frame for a lively
      // flicker; desktop holds it fixed so only the smooth frequency waves below move the letters.
      if (!isMobile && turbRef.current) turbRef.current.setAttribute('seed', DESKTOP_SEED)
      function animate() {
        if (turbRef.current) {
          const fx = 0.012 + Math.sin(tRef.current * 0.3) * 0.008
          const fy = 0.006 + Math.cos(tRef.current * 0.2) * 0.004
          turbRef.current.setAttribute('baseFrequency', `${fx} ${fy}`)
          if (isMobile) turbRef.current.setAttribute('seed', (tRef.current * 3) % 200)
        }
        tRef.current += step
        rafRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      cancelAnimationFrame(rafRef.current)
      if (turbRef.current) {
        turbRef.current.setAttribute('baseFrequency', '0 0')
      }
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, isMobile, step])

  const fontSize = isMobile ? 28 : 20
  const width = isMobile ? 231 : 165
  const height = isMobile ? 36 : 26
  const y = isMobile ? 31 : 22

  return (
    <svg
      width={width}
      height={height}
      style={{ overflow: 'visible', display: 'block', cursor: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <defs>
        <filter id="warp" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            ref={turbRef}
            type="turbulence"
            baseFrequency="0 0"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <text
        filter={active ? 'url(#warp)' : undefined}
        fontFamily='"Space Mono", monospace'
        fontWeight="700"
        fontSize={fontSize}
        fill={active ? '#0000EE' : '#111'}
        x="0"
        y={y}
      >
        ATMIKA PAI
      </text>
    </svg>
  )
}
