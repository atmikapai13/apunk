const { execSync } = require('child_process')
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

// Stamped at build time — npm run deploy always builds immediately before publishing,
// so this reflects the actual deploy date rather than the last commit date.
const today = new Date().toISOString().slice(0, 10)
fs.writeFileSync(lastUpdatedPath, JSON.stringify({ date: today }, null, 2))
