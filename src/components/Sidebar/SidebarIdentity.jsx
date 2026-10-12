import { Link } from 'react-router-dom'
import WarpName from './WarpName'
import LastUpdated from './LastUpdated'

export default function SidebarIdentity({ onNavigate }) {
  return (
    <div>
      <Link to="/" onClick={onNavigate} style={{ display: 'block' }}><WarpName /></Link>
      <LastUpdated />
    </div>
  )
}
