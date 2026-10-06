import { Link } from 'react-router-dom'
import WarpName from './WarpName'
import styles from './Sidebar.module.css'
import lastUpdated from '../../data/lastUpdated.json'

function formatDate(isoDate) {
  // date string is 'YYYY-MM-DD'; parse as local to avoid UTC off-by-one
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Changes are tracked separately for me and for my Instinct agent (see scripts/generate-activity.cjs).
function LastUpdated() {
  return (
    <p className={styles.clock}>
      Last updated
      {lastUpdated.me && <><br />by me: {formatDate(lastUpdated.me)}</>}
      {lastUpdated.agent && <><br />by my agent: {formatDate(lastUpdated.agent)}</>}
    </p>
  )
}

export default function SidebarIdentity({ onNavigate }) {
  return (
    <div>
      <Link to="/" onClick={onNavigate} style={{ display: 'block' }}><WarpName /></Link>
      <LastUpdated />
    </div>
  )
}
