// Downloads tabs of my Google Sheet and writes each to a JSON file in src/data/.
// Runs before `dev` and `build`, so the deployed site always has the sheet as it was at build time.
// The sheet must be readable without a login (Share > Anyone with the link: Viewer).
// If a download fails (offline, sheet unshared), that tab's existing JSON file is kept.
const fs = require('fs')
const path = require('path')

const SHEET_ID = '1na-wn3B40g4TpuHX4A97epy7KzuUErMhBLGlVJsc9Ws'
const dataDir = path.join(__dirname, '..', 'src/data')

const tabUrl = tab => `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`

// The Articles tab may leave a name blank: fall back to the URL's last path segment, e.g.
// ".../sam-altman-may-control-our-future" becomes "sam altman may control our future".
const titleFromUrl = url => {
  const slug = new URL(url).pathname.split('/').filter(Boolean).pop() || new URL(url).hostname
  return decodeURIComponent(slug).replace(/[-_]+/g, ' ').trim()
}
const hostOf = url => new URL(url).hostname.replace(/^www\./, '')

const TABS = [
  {
    tab: 'Movies',
    file: 'movies.json',
    columns: ['movie', 'date', 'theater', 'festival'],
    // newest first
    toRecord: ([title, date, theater, festival]) => ({ title, date, theater: theater || undefined, festival: festival || undefined }),
    required: ['title', 'date'],
    sort: (a, b) => b.date.localeCompare(a.date),
  },
  {
    tab: 'Borrowed books',
    file: 'books.json',
    columns: ['library', 'title', 'author (as recorded)', 'checkout date', 'include'],
    toRecord: ([library, title, author, date, include]) => ({
      include: /^yes$/i.test(include || ''),
      title,
      author: author || undefined,
      library: library || undefined,
      date: date || undefined, // current loans have no checkout date
    }),
    required: ['title', 'include'], // only rows marked Yes in the sheet's Include column
    // undated current loans first, then newest first
    sort: (a, b) => (!a.date - !b.date) * -1 || (b.date || '').localeCompare(a.date || ''),
  },
  {
    tab: 'Articles',
    file: 'articles.json',
    columns: ['article name', 'url', 'publication', 'published date', 'author'],
    toRecord: ([title, url, publication, date, author]) => ({
      title: title || (url && titleFromUrl(url)),
      author: author || undefined,
      url,
      source: publication || (url && hostOf(url)), // publication; defaults to the site's domain
      date: date || undefined, // undated rows count as this year
    }),
    required: ['title', 'url'],
    // undated first, then newest first
    sort: (a, b) => (!a.date - !b.date) * -1 || (b.date || '').localeCompare(a.date || ''),
  },
]

// Minimal CSV parser: handles quoted cells, doubled quotes and commas/newlines inside quotes
function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cell); cell = ''
      rows.push(row); row = []
    } else cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows
}

async function fetchTab({ tab, file, columns, toRecord, required, sort }) {
  const res = await fetch(tabUrl(tab))
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const [header, ...rows] = parseCsv(await res.text()).filter(r => r.some(Boolean))
  const names = header.map(h => h.trim().toLowerCase())
  const idx = columns.map(c => names.indexOf(c))
  if (idx.includes(-1)) throw new Error(`Unexpected columns: ${header.join(', ')}`)

  const records = rows
    .map(r => toRecord(idx.map(i => r[i]?.trim())))
    .filter(rec => required.every(k => rec[k]))
    .map(({ include, ...rec }) => rec)
    .sort(sort)

  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(records, null, 2) + '\n')
  console.log(`${file} written: ${records.length} rows`)
}

for (const config of TABS) {
  fetchTab(config).catch(err => {
    console.log(`Could not fetch "${config.tab}" (${err.message}), keeping existing ${config.file}`)
  })
}
