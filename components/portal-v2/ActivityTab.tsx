'use client'

import { Timeline } from './Timeline'
import { AskBox } from './AskBox'
import type { EventItem } from './types'

type Props = {
  events: EventItem[]
  slug: string
  agentName: string
  onSent: () => void
}

export function ActivityTab({ events, slug, agentName, onSent }: Props) {
  return (
    <div>
      <Timeline events={events} />
      <AskBox slug={slug} agentName={agentName} onSent={onSent} />
    </div>
  )
}
