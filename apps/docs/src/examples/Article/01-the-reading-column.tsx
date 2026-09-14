import { Article } from '@misoto22/folio'

/**
 * The whole reading surface, styled from element selectors rather than from
 * classes — because the input is usually not JSX but a string from a Markdown
 * pipeline, and there is no component to hang a class on. Two things to know
 * before using it. The rhythm is a direct-child combinator, so a div wrapped
 * around a run of paragraphs, even a display:contents one, costs all of them
 * their spacing. And it sets a MEASURE, not a layout: with no auto margins of
 * its own it sits against the start edge of a wide page until a parent centres
 * it. The standfirst is marked by the author with p.lead, never inferred, since
 * a stylesheet that promotes whatever came first gets it wrong the moment a
 * post opens on an image.
 */
export function Example() {
  return (
    <Article>
      <h2 id="a-heading">A heading, in the editorial serif</h2>
      <p className="lead">
        The opening paragraph is marked, not guessed. It is set at the item size
        in full ink, which is the one place a paragraph is allowed the top of
        the ladder.
      </p>
      <p>
        Body copy sits on the reading measure and nothing wider, with{' '}
        <a href="#a-heading">a link</a>, some <code>inline code</code> and a{' '}
        <strong>strong</strong> word in it.
      </p>
      <blockquote>
        Depth is a hairline and a change of ground, never a blur.
        <cite>The White Reset, law 2</cite>
      </blockquote>
      <ul>
        <li>The list marker is a hairline dash, not a filled disc.</li>
        <li>A filled circle in this system means a status dot.</li>
      </ul>
    </Article>
  )
}
