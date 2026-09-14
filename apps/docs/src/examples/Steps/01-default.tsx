import { Steps } from '@misoto22/folio'

/**
 * A pipeline as a rail: one thing after another, each with a noun for a name
 * and a mono line of detail under it. The order is the content, so this is an
 * ol — and label is the list's only name here, because no heading above it says
 * what the sequence is. Exactly one step is current, which is the one thing the
 * rail states rather than draws.
 */
export function Example() {
  return (
    <Steps
      label="How an answer is built"
      steps={[
        { title: 'Corpus', note: 'Blog MDX · project database · profile' },
        { title: 'Chunking', note: 'By heading · 300–800 tokens' },
        { title: 'Embedding', note: 'Voyage 3.5-lite · 1024 dimensions' },
        { title: 'Storage', note: 'pgvector — the site’s own database' },
        { title: 'Retrieval', note: 'Top 5 by cosine · 0.2 floor' },
        { title: 'Answer', note: 'Reasoning filtered · live citations', current: true },
      ]}
    />
  )
}
