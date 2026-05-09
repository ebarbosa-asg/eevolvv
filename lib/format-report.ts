export function formatReport(text: string): string {
  let sectionIdx = 0
  const sections = text.split(/(?=###\s)/).map(chunk => {
    const m = chunk.match(/^###\s+(.+?)\n([\s\S]*)$/)
    if (!m) {
      return `<p>${chunk.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')}</p>`
    }
    const [, heading, body] = m
    const delay = sectionIdx * 120
    sectionIdx++
    const formatted = body.trim()
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .split('\n\n')
      .map(para => {
        const lines = para.trim().split('\n')
        if (lines.length > 1 && lines.every(l => l.trim().startsWith('- '))) {
          return `<ul>${lines.map(l => `<li>${l.replace(/^- /, '')}</li>`).join('')}</ul>`
        }
        return `<p>${lines.join('<br />')}</p>`
      })
      .join('')
    return `<h3 class="report-section-fade" style="animation-delay:${delay}ms">${heading}</h3>${formatted}`
  })
  const sig = `<div class="report-volvve-sig">
    <div class="report-volvve-sig__line"></div>
    <div class="report-volvve-sig__text">Diagnostic prepared exclusively by Volvv-E · eevolvv AI Engine</div>
    <div class="report-volvve-sig__sub">Every opportunity above is specific to your operation, tools, and revenue range.</div>
  </div>`
  return sections.join('') + sig
}
