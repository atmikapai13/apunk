import styles from './Sidebar.module.css'
import lastUpdated from '../../data/lastUpdated.json'

function formatDate(isoDate) {
  // date string is 'YYYY-MM-DD'; parse as local to avoid UTC off-by-one
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Changes are tracked separately for me and for my Instinct agent (see scripts/generate-activity.cjs).
// Reads as a diary line: "Last updated Oct 12 by me, Oct 10 by my agent". Each clause keeps its words together
// (non-breaking spaces), so in the narrow sidebar it wraps between the clauses, never in the middle of one.
export default function LastUpdated() {
  const { me, agent } = lastUpdated
  const clauses = me && agent && me === agent
    ? [`${formatDate(me)} by my agent and I`]
    : [me && `${formatDate(me)} by me`, agent && `${formatDate(agent)} by my agent`].filter(Boolean)

  return (
    <p className={styles.clock}>
      <span>Last{'\u00a0'}updated</span>{' '}
      {clauses.map((text, i) => (
        <span key={i}>{text.replace(/ /g, '\u00a0')}{i < clauses.length - 1 ? ', ' : ''}</span>
      ))}
    </p>
  )
}
