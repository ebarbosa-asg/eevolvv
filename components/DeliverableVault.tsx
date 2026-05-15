'use client'

import { SectionMarker } from '@/components/ds'

export type Deliverable = {
  id: string
  title: string
  type: 'report' | 'code' | 'doc' | 'map'
  status: 'locked' | 'unlocked'
  url?: string
}

export function DeliverableVault({ deliverables }: { deliverables: Deliverable[] }) {
  if (!deliverables || deliverables.length === 0) return null;

  return (
    <div className="mt-12">
      <SectionMarker num="03" label="ASSET VAULT" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {deliverables.map((d) => (
          <div 
            key={d.id}
            className={`p-4 border transition-all duration-300 ${
              d.status === 'unlocked' 
                ? 'bg-white/5 border-white/20 hover:border-accent cursor-pointer' 
                : 'bg-transparent border-white/5 opacity-40'
            }`}
          >
            <div className="mono text-[8px] tracking-[0.2em] text-accent uppercase mb-2">
              {d.type + ' · ' + d.status}
            </div>
            <div className="text-sm font-medium text-white mb-4 leading-tight">{d.title}</div>
            {d.status === 'unlocked' ? (
              <a href={d.url} target="_blank" rel="noopener noreferrer" className="mono text-[10px] text-accent uppercase tracking-widest hover:underline">
                → Access
              </a>
            ) : (
              <div className="mono text-[10px] text-white/20 uppercase tracking-widest">
                En Route
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
