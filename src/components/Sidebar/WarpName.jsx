import { useEffect, useRef, useState } from 'react'

export default function WarpName() {
  const turbRef = useRef(null)
  const rafRef = useRef(null)
  const tRef = useRef(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (hovered) {
      function animate() {
        if (turbRef.current) {
          const fx = 0.012 + Math.sin(tRef.current * 0.3) * 0.008
          const fy = 0.006 + Math.cos(tRef.current * 0.2) * 0.004
          turbRef.current.setAttribute('baseFrequency', `${fx} ${fy}`)
          turbRef.current.setAttribute('seed', (tRef.current * 3) % 200)
        }
        tRef.current += 0.018
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
  }, [hovered])

  return (
    <svg
      width="165"
      height="26"
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
        filter={hovered ? 'url(#warp)' : undefined}
        fontFamily='"Space Mono", monospace'
        fontWeight="700"
        fontSize="20"
        fill="#111"
        x="0"
        y="22"
      >
        ATMIKA PAI
      </text>
    </svg>
  )
}
