import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import WarpName from './WarpName'
import styles from './Sidebar.module.css'

function DayDate() {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setDate(new Date()), 60 * 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <p className={styles.clock}>
      {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
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
