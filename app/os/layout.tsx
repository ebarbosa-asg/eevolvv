import OSLayoutClient from './OSLayoutClient'

const LAYOUT_CSS = `
  .os-layout { display: flex; min-height: 100vh; }
  .os-sidebar-space { flex-shrink: 0; overflow: hidden; transition: width 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
  .os-main { flex: 1; min-width: 0; }
  .os-sidebar-overlay {
    position: fixed;
    inset: 0;
    z-index: 88;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    background: rgba(5, 5, 4, 0.52);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: os-sidebar-overlay-in 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
  @keyframes os-sidebar-overlay-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
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
