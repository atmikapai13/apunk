import { createContext, useMemo, useState } from 'react'

// Lets accordions inside it behave like a set: opening one closes the others.
// The open one is remembered per group, so a returning visitor finds it as they left it.
export const AccordionGroupContext = createContext(null)

const STORAGE_PREFIX = 'accordion-group:'

// Stored as the id of the open accordion, or an empty string when all are closed.
// localStorage can be unavailable (private windows, blocked storage), so every access is guarded.
function readOpenId(groupId, fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + groupId)
    return saved === null ? fallback : saved || null
  } catch {
    return fallback
  }
}

function saveOpenId(groupId, openId) {
  try {
    localStorage.setItem(STORAGE_PREFIX + groupId, openId ?? '')
  } catch {
    // ignore: the group still works, it just won't be remembered
  }
}

export default function AccordionGroup({ id, defaultOpenId = null, children }) {
  const [openId, setOpenId] = useState(() => readOpenId(id, defaultOpenId))

  const value = useMemo(() => ({
    openId,
    toggle: itemId => {
      const next = openId === itemId ? null : itemId
      setOpenId(next)
      saveOpenId(id, next)
    },
  }), [id, openId])

  return <AccordionGroupContext.Provider value={value}>{children}</AccordionGroupContext.Provider>
}
