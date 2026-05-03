import OSLayoutClient from './OSLayoutClient'

const LAYOUT_CSS = `
  .os-layout { display: flex; min-height: 100vh; }
  .os-sidebar-space { flex-shrink: 0; overflow: hidden; transition: width 0.22s ease; }
  .os-main { flex: 1; min-width: 0; }
  @media (max-width: 1024px) {
    .os-sidebar-space { display: none; }
    .os-main { width: 100%; }
  }
`

export default function OSLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{LAYOUT_CSS}</style>
      <OSLayoutClient>{children}</OSLayoutClient>
    </>
  )
}
