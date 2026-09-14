'use client'

import { useState } from 'react'
import { ConversationAnswer, ConversationProse, ConversationThread, QuestionComposer } from '@misoto22/folio/website'

/**
 * The host owns the questions and rendered answer nodes while the composition owns their reading order.
 * This local example records questions without calling an assistant service.
 */
export function Example() {
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
  return (
    <ConversationThread label="Library conversation" hasTurns={questions.length > 0}
      summary={`${questions.length} questions`}
      intro={questions.length ? undefined : {
        title: 'Explore the library', description: 'Try a question to preview the conversation layout.',
        suggestionsLabel: 'Start with', suggestions: [{ id: 'recent', label: 'What has been added recently?', onSelect: () => setQuestion('What has been added recently?') }],
      }}
      composer={<QuestionComposer id="conversation-example-question" label="Your question" value={question} onValueChange={setQuestion}
        placeholder="Ask about the collection" submitLabel="Add question" submitDisabled={!question.trim()}
        hint="Local demonstration; no service request is made."
        onSubmit={() => { if (question.trim()) { setQuestions((items) => [...items, question.trim()]); setQuestion('') } }} />}>
      {questions.map((item, index) => <ConversationAnswer key={`${index}-${item}`} questionLabel="Question" question={item}>
        <ConversationProse><p>The question is now part of this local conversation. A connected application would supply its answer here.</p></ConversationProse>
      </ConversationAnswer>)}
    </ConversationThread>
  )
}
