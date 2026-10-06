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

// "Last updated" is the date of the latest commit that changed the site itself. Commits that only touch the
// weekly events data (or the files this script generates) don't count, so the Instinct agent's weekly
// events.json update leaves the date alone. Needs full git history, which the deploy workflow checks out.
const CONTENT_PATHSPEC = [
  'src/',
  ':(exclude)src/data/events.json',
  ':(exclude)src/data/activity.json',
  ':(exclude)src/data/lastUpdated.json',
]

try {
  const lastContentDate = execFileSync(
    'git', ['log', '-1', '--format=%ad', '--date=short', '--', ...CONTENT_PATHSPEC],
    { cwd: root }
  ).toString().trim()
  if (lastContentDate) {
    fs.writeFileSync(lastUpdatedPath, JSON.stringify({ date: lastContentDate }, null, 2))
    console.log(`Last updated: ${lastContentDate}`)
  }
} catch {
  console.log('Could not read git history, keeping existing lastUpdated.json')
}
