import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import styles from './Layout.module.css'

const ACTIVE_BY_PREFIX = [
  ['/projects-grid', 'projects'],
  ['/projects-carousel', 'projects'],
  ['/writing', 'writing'],
  ['/contact', 'contact'],
]

function activeFor(pathname) {
  return ACTIVE_BY_PREFIX.find(([prefix]) => pathname.startsWith(prefix))?.[1]
}

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className={styles.shell}>
      <Sidebar active={activeFor(pathname)} />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
