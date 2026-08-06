import { Link } from 'react-router-dom'
import WarpName from './WarpName'
import styles from './Sidebar.module.css'
import lastUpdated from '../../data/lastUpdated.json'

function DayDate() {
  // date string is 'YYYY-MM-DD'; parse as local to avoid UTC off-by-one
  const [year, month, day] = lastUpdated.date.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return (
    <p className={styles.clock}>
      Last updated {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
    </p>
  )
}

export default function SidebarIdentity({ onNavigate }) {
  return (
    <div>
      <Link to="/" onClick={onNavigate} style={{ display: 'block' }}><WarpName /></Link>
      <DayDate />
    </div>
  )
}
