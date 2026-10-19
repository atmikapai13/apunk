import { useEffect, useRef, useState } from 'react'

const MOBILE_QUERY = '(max-width: 900px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

// How fast the animation clock advances per frame, which sets how quickly the letters ripple.
const STEP = 0.018

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

  // The name is static (black) until hovered, when it turns blue and warps. On mobile it is always moving.
  // Visitors who ask their system to reduce motion get none.
  const active = !reduceMotion && (isMobile || hovered)

  useEffect(() => {
    if (active) {
      function animate() {
        if (turbRef.current) {
          const fx = 0.012 + Math.sin(tRef.current * 0.3) * 0.008
          const fy = 0.006 + Math.cos(tRef.current * 0.2) * 0.004
          turbRef.current.setAttribute('baseFrequency', `${fx} ${fy}`)
          turbRef.current.setAttribute('seed', (tRef.current * 3) % 200)
        }
        tRef.current += STEP
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
  }, [active])

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
