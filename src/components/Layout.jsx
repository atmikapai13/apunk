import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import styles from './Layout.module.css'

const ACTIVE_BY_PREFIX = [
  ['/projects-grid', 'projects'],
  ['/projects-carousel', 'projects'],
  ['/writing', 'writing'],
  ['/media', 'writing'],
  ['/contact', 'contact'],
]

function activeFor(pathname) {
  return ACTIVE_BY_PREFIX.find(([prefix]) => pathname.startsWith(prefix))?.[1]
}

export default function Layout() {
  const { pathname } = useLocation()

  // Every page opens at the very top: on first load (the browser would otherwise restore the old scroll
  // position) and on every navigation (the router keeps the previous page's scroll position)
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={styles.shell}>
      <Sidebar active={activeFor(pathname)} />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
