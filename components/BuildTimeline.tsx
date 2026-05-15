'use client'

export type TimelineEvent = {
  id: string
  label: string
  timestamp: string
  status: 'completed' | 'in_progress' | 'pending'
}

export function BuildTimeline({ events }: { events: TimelineEvent[] }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="mt-12 bg-[#0A0A09] border border-white/5 p-6 md:p-8">
      <div className="mono text-[10px] tracking-[0.25em] text-accent font-bold mb-8 uppercase">
        SYSTEM BUILD LOG · ACTIVE
      </div>
      <div className="space-y-6">
        {events.map((e, idx) => (
          <div key={e.id} className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className={`w-2 h-2 mt-2 rounded-full ${
                e.status === 'completed' ? 'bg-accent' : 
                e.status === 'in_progress' ? 'bg-accent animate-pulse' : 'bg-white/10'
              }`} />
              {idx !== events.length - 1 && <div className="w-[1px] h-full bg-white/5 my-2" />}
            </div>
            <div className="pb-4">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${e.status === 'pending' ? 'text-white/20' : 'text-white'}`}>
                  {e.label}
                </span>
                {e.status === 'completed' && <span className="mono text-[8px] text-accent/60 uppercase tracking-widest font-bold">verified</span>}
              </div>
              <div className="mono text-[10px] text-white/30 mt-1 uppercase tracking-tighter">
                {e.status === 'pending' ? 'standing by' : e.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
