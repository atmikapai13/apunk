const { execSync, execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const outPath = path.join(root, 'src/data/activity.json')
const lastUpdatedPath = path.join(root, 'src/data/lastUpdated.json')

let activity = {}

try {
  const output = execSync('git log --format="%ad" --date=short -- src/', { cwd: root }).toString()
  const dates = output.trim().split('\n').filter(Boolean)
  dates.forEach(date => {
    activity[date] = (activity[date] || 0) + 1
  })
  console.log(`Activity written: ${Object.keys(activity).length} days tracked`)
} catch {
  // No commits yet — preserve any existing files
  if (fs.existsSync(outPath)) {
    console.log('No git history yet, keeping existing activity.json')
    process.exit(0)
  }
  console.log('No git history yet, writing empty activity.json')
}

fs.writeFileSync(outPath, JSON.stringify(activity, null, 2))

// "Last updated" is tracked separately for me and for my Instinct agent.
// The agent only refreshes the weekly calendar, so a commit that changes nothing in src/ except
// src/data/events.json counts as the agent's. Any other commit that changes site files counts as mine.
// Files this script generates are ignored. Needs full git history, which the deploy workflow checks out.
const AGENT_FILES = new Set(['src/data/events.json'])
const GENERATED_FILES = new Set(['src/data/activity.json', 'src/data/lastUpdated.json'])

try {
  const log = execFileSync('git', ['log', '--format=@@%h %ad', '--date=short', '--name-only'], { cwd: root }).toString()
  let me = null
  let agent = null
  for (const block of log.split('@@').filter(Boolean)) {
    const [header, ...fileLines] = block.split('\n')
    const [hash, date] = header.split(' ')
    const srcFiles = fileLines.filter(f => f.startsWith('src/') && !GENERATED_FILES.has(f))
    if (srcFiles.length === 0) continue
    const agentOnly = srcFiles.every(f => AGENT_FILES.has(f))
    if (agentOnly && !agent) agent = { date, hash }
    if (!agentOnly && !me) me = { date, hash }
    if (me && agent) break
  }
  const lastUpdated = {}
  if (me) lastUpdated.me = me.date
  if (agent) lastUpdated.agent = agent.date
  if (me || agent) {
    fs.writeFileSync(lastUpdatedPath, JSON.stringify(lastUpdated, null, 2))
    console.log(`Last updated: me ${me?.date} (${me?.hash}), agent ${agent?.date} (${agent?.hash})`)
  }
} catch {
  console.log('Could not read git history, keeping existing lastUpdated.json')
}
