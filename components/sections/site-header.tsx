'use client'

export default function SiteHeader() {
  return (
    <header className="site">
      <div className="site-rail header-inner">
        <a href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="eevolvv" style={{ imageRendering: 'pixelated' }} />
        </a>
        <nav className="primary">
          <a href="#free-report" className="active">Free report</a>
          <a href="#capabilities">Capabilities</a>
          <a href="/api/stripe/checkout?product=report-roadmap&source=header">Roadmap</a>
        </nav>
        <a href="/diagnostic" className="header-cta">
          Get report
          <span>→</span>
        </a>
      </div>
    </header>
  )
}