import { Article } from '@misoto22/folio'

const RELEASES = [
  { version: '0.4.0', date: '2026-09-02', components: 58, tokens: 214, size: '38.9 kB', tag: 'v0.4.0' },
  { version: '0.3.1', date: '2026-08-24', components: 52, tokens: 209, size: '36.1 kB', tag: 'v0.3.1' },
  { version: '0.3.0', date: '2026-08-11', components: 49, tokens: 205, size: '35.4 kB', tag: 'v0.3.0' },
]

/**
 * Three things are allowed out of the 46rem measure, because they are unreadable
 * inside it: a figure, a table, and anything the pipeline marks folio-wide. A
 * table has nothing of its own to scroll in, so six columns push the whole PAGE
 * sideways unless the table is wrapped in folio-table-scroll — have the pipeline
 * do that wrapping rather than hoping the content stays narrow. Drag the table
 * below sideways and the column around it stays put. Note the heading depth
 * too: h5 and h6 are set as mono eyebrows rather than as smaller headings, so a
 * document that nests six levels loses its hierarchy at exactly the depth that
 * needed one.
 */
export function Example() {
  return (
    <Article>
      <h2>What each release changed</h2>
      <p>
        The table is wider than the column it sits in, which is the point: it
        scrolls inside its own wrapper instead of taking the page with it.
      </p>
      <div className="folio-table-scroll">
        <table>
          <caption>Published releases</caption>
          <thead>
            <tr>
              <th scope="col">Version</th>
              <th scope="col">Released</th>
              <th scope="col">Components</th>
              <th scope="col">Tokens</th>
              <th scope="col">Bundle</th>
              <th scope="col">Tag</th>
            </tr>
          </thead>
          <tbody>
            {RELEASES.map((release) => (
              <tr key={release.version}>
                <th scope="row">{release.version}</th>
                <td>{release.date}</td>
                <td>{release.components}</td>
                <td>{release.tokens}</td>
                <td>{release.size}</td>
                <td>{release.tag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figure>
        <div className="grid h-28 place-items-center rounded-(--radius) bg-(--stone) mono-meta text-(--ink-3-aa)">
          a figure, out past the measure
        </div>
        <figcaption>A figure takes the full width too, and keeps its caption with it.</figcaption>
      </figure>
    </Article>
  )
}
