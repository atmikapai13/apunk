import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import styles from './Writing.module.css'
import { writings as WRITINGS_DATA } from '../data/writings.json'

const VISITED_KEY = 'visitedWritings'

function loadVisited() {
  try {
    return new Set(JSON.parse(localStorage.getItem(VISITED_KEY)) || [])
  } catch {
    return new Set()
  }
}

const writings = [...WRITINGS_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))

function renderItalics(text) {
  return text.split('*').map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))
}

// An annotation may itself contain one [linkText](url) markdown link.
function renderAnnotation(text) {
  const linkMatch = text.match(/^(.*)\[(.*?)\]\((.*?)\)(.*)$/s)
  if (!linkMatch) return renderItalics(text)
  const [, before, linkText, url, after] = linkMatch
  return [
    ...renderItalics(before),
    <a key="link" href={url} target="_blank" rel="noreferrer" className={styles.annotationLink}>{linkText}</a>,
    ...renderItalics(after)
  ]
}

// Title format: "Main title --- annotation one --- annotation two"
function renderTitle(title) {
  const [main, ...rest] = title.split(' --- ')
  return { main: renderItalics(main), annotations: rest.map(renderAnnotation) }
}

const CATEGORY_TREE = [
  { label: 'Economics', children: [{ label: '', category: 'Econometrics' }, { label: 'Mapping the Bay', category: 'Mapping the Bay', italicPrefix: 'Series' }, { label: 'White Papers', category: 'Econometrics White Papers', headingClassName: 'whitePapersHeading', sectionClassName: 'whitePapersSection' }] },
  { label: 'Cartography', children: [{ label: '', category: 'Cartography' }, { label: 'Conferences', category: 'Cartography Conferences' }, { label: 'White Papers', category: 'Cartography White Papers', headingClassName: 'whitePapersHeading', sectionClassName: 'whitePapersSection' }, { label: 'Mentions', category: 'Cartography Mentions', headingClassName: 'whitePapersHeading', sectionClassName: 'whitePapersSection' }] },
  { label: 'Literature', children: [{ label: '', category: 'Literature' }, { label: 'Philosophy', category: 'Philosophy' }] },
  { label: 'Mentions', children: [{ label: '', category: 'Mentions' }, { label: 'Keeping It Urban Summit (2026)', category: 'Keeping It Urban Summit' }] },
]

function EntryLink({ item, isExternal, className, onClick, children }) {
  return isExternal
    ? <a href={item.source} target="_blank" rel="noreferrer" className={className} onClick={onClick}>{children}</a>
    : <Link to={`/writing/${item.slug}`} className={className} onClick={onClick}>{children}</Link>
}

function CategoryNode({ node, depth }) {
  const [visited, setVisited] = useState(loadVisited)
  const items = writings
    .filter(w => w.category === (node.category || node.label))
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || new Date(b.date) - new Date(a.date))
  if (!node.children && !items.length) return null

  const markVisited = (slug) => {
    if (visited.has(slug)) return
    const next = new Set(visited).add(slug)
    localStorage.setItem(VISITED_KEY, JSON.stringify([...next]))
    setVisited(next)
  }

  const isWhitePapers = node.sectionClassName === 'whitePapersSection'

  return (
    <section className={`${depth === 0 ? styles.category : styles.subcategory} ${node.sectionClassName ? styles[node.sectionClassName] : ''}`}>
      <p className={`${depth === 0 ? styles.categoryHeading : styles.subcategoryHeading} ${node.headingClassName ? styles[node.headingClassName] : ''}`}>
        {node.italicPrefix && <em>{node.italicPrefix}: </em>}
        {node.label}
      </p>
      {node.children
        ? node.children.map(child => <CategoryNode key={child.label} node={child} depth={depth + 1} />)
        : (
          <ul className={styles.categoryList}>
            {items.map(w => {
              const { main, annotations } = renderTitle(w.title)
              const linkClass = `${styles.categoryLink} ${visited.has(w.slug) ? styles.categoryLinkVisited : ''}`
              return (
                <li key={w.slug}>
                  <EntryLink
                    item={w}
                    isExternal={w.source && !w.sections?.length}
                    className={linkClass}
                    onClick={() => markVisited(w.slug)}
                  >
                    {!isWhitePapers && <ArrowUpRight size={14} strokeWidth={2.1} className={styles.categoryArrow} />}
                    {main}
                  </EntryLink>
                  {annotations.map((a, i) => <div key={i} className={styles.annotation}>— {a}</div>)}
                </li>
              )
            })}
          </ul>
        )}
    </section>
  )
}

function WritingIndex() {
  return (
    <div className={styles.center}>
      {CATEGORY_TREE.map(node => <CategoryNode key={node.label} node={node} depth={0} />)}
    </div>
  )
}

function Article({ article }) {
  const { main, annotations } = renderTitle(article.title)
  return (
    <div className={styles.center}>
      <article className={styles.article}>
        <p className={styles.articleBody} style={{ color: 'var(--muted-text)', marginBottom: '4px' }}>
          {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <h2 className={styles.articleTitle}>
          {article.source
            ? <a href={article.source} target="_blank" rel="noreferrer" className={styles.articleTitleLink}>
                <ArrowUpRight size={26} strokeWidth={1.6} className={styles.articleArrow} />
                {main}
              </a>
            : main}
          {annotations.map((a, i) => <div key={i} className={styles.annotation}>— {a}</div>)}
        </h2>
        {article.embed && (
          <iframe
            src={article.embed}
            className={styles.sectionDocument}
            allow="autoplay"
            title={article.title}
          />
        )}
        {article.sections.map((section, j) => (
          <div key={j}>
            {section.heading && (
              <h3 className={styles.sectionHeading}>{section.heading}</h3>
            )}
            {section.video && (
              <iframe
                src={section.video}
                className={styles.sectionVideo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={article.title}
              />
            )}
            {section.images?.map((img, k) => (
              <img key={k} src={img.src} alt={img.alt} className={styles.sectionImage} />
            ))}
            {section.body?.map((p, k) => (
              <p key={k} className={styles.articleBody}>{p}</p>
            ))}
            {section.bibliography && (
              <ol className={styles.bibliography}>
                {section.bibliography.map((item, k) => (
                  <li key={k} className={styles.bibItem}>
                    {item.url
                      ? <a href={item.url} target="_blank" rel="noreferrer">{item.text}</a>
                      : item.text}
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </article>
    </div>
  )
}

export default function Writing() {
  const { slug } = useParams()
  const article = slug ? writings.find(w => w.slug === slug) : null

  if (slug && !article) {
    return (
      <div className={styles.center}>
        <p className={styles.articleBody}>Not found. <Link to="/writing" className={styles.categoryLink}>Back to Writing</Link></p>
      </div>
    )
  }

  return article ? <Article article={article} /> : <WritingIndex />
}
