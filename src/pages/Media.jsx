import StickyBand from '../components/StickyBand'
import MobileHeader from '../components/MobileHeader'
import movies from '../data/movies.json'
import books from '../data/books.json'
import articles from '../data/articles.json'
import styles from './Media.module.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Dates are read from the ISO string directly to avoid timezone shifts
function formatDay(iso) {
  const [, m, d] = iso.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}`
}

// The books sheet records NYPL authors as "Last, First"
function formatAuthor(author) {
  const [last, first] = author.split(', ')
  return first ? `${first} ${last}` : author
}

// Groups entries by year, newest year first. Entries without a date (books on loan right now) belong to this year.
function groupByYear(entries) {
  const thisYear = String(new Date().getFullYear())
  const years = {}
  for (const entry of entries) {
    const year = entry.date ? entry.date.slice(0, 4) : thisYear
    ;(years[year] ||= []).push(entry)
  }
  return years
}

function Entry({ date, children }) {
  return (
    <li className={styles.entry}>
      <span className={styles.date}>{date ? formatDay(date) : ''}</span>
      <span className={styles.body}>{children}</span>
    </li>
  )
}

export default function Media() {
  const filmsByYear = groupByYear(movies)
  const booksByYear = groupByYear(books)
  const articlesByYear = groupByYear(articles)
  const years = [...new Set([...Object.keys(filmsByYear), ...Object.keys(booksByYear), ...Object.keys(articlesByYear)])].sort().reverse()

  return (
    <div className={styles.center}>
      <MobileHeader page="media" />
      <StickyBand className={styles.intro}>
        <p>
          I'm experimenting with something new here, availed by consumer agents and coding on the fly.
        </p>
        <p>
          I've given my <a href="https://instinct.com/" target="_blank" rel="noreferrer">Instinct agent</a> access to my New York Public Library, Brooklyn Public Library, and AMC accounts, and every week it pulls my activity. I also share articles with it, and it keeps a running log.
        </p>
        <p>
          Here's a non-exhaustive list of my media consumptions:
        </p>
      </StickyBand>
      {years.map(year => (
        <section key={year} className={styles.year}>
          <h2 className={styles.yearHeading}>{year}</h2>

          {filmsByYear[year] && (
            <section className={styles.group}>
              <h3 className={styles.groupHeading}>Films</h3>
              <ul className={styles.list}>
                {filmsByYear[year].map(m => (
                  <Entry key={m.title + m.date} date={m.date}>
                    {m.title}
                    {m.theater && <span className={styles.meta}>, {m.theater}</span>}
                    {m.festival && <span className={styles.meta}> ({m.festival})</span>}
                  </Entry>
                ))}
              </ul>
            </section>
          )}

          {booksByYear[year] && (
            <section className={styles.group}>
              <h3 className={styles.groupHeading}>Books</h3>
              <ul className={styles.list}>
                {booksByYear[year].map(b => (
                  <Entry key={b.title + (b.date || '')} date={b.date}>
                    {b.title}
                    {b.author && <span className={styles.meta}> by {formatAuthor(b.author)}</span>}
                  </Entry>
                ))}
              </ul>
            </section>
          )}

          {articlesByYear[year] && (
            <section className={styles.group}>
              <h3 className={styles.groupHeading}>Articles</h3>
              <ul className={styles.list}>
                {articlesByYear[year].map(a => (
                  <Entry key={a.url} date={a.date}>
                    <a href={a.url} target="_blank" rel="noreferrer" className={styles.link}>
                      {a.title}
                    </a>
                    <span className={styles.byline}>
                      {a.author && <>by {a.author}</>}
                      {a.author && a.source && ' · '}
                      {a.source}
                    </span>
                  </Entry>
                ))}
              </ul>
            </section>
          )}
        </section>
      ))}
    </div>
  )
}
