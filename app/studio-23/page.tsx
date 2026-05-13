import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio 23 Roofing and Construction LLC',
  description:
    'Veteran-owned roofing and construction company specializing in residential, multifamily, commercial roofing, fencing, gutters, and insurance claim support.',
  robots: { index: false, follow: false },
}

const CONTACT = {
  email: 'info@studio23roofing.com',
  phone: '(512) 758-0200',
  tel: '+15127580200',
  address: ['5000 Gattis School Rd', 'Suite 100-117', 'Hutto, TX 78634'],
}

const HERO_IMAGES = [
  { src: '/client-assets/studio-23/crops/roof-ridge.png', alt: 'Completed shingle roof ridge by Studio 23' },
  { src: '/client-assets/studio-23/crops/active-roof-job.png', alt: 'Active residential roof installation by Studio 23' },
  { src: '/client-assets/studio-23/crops/fence-run.png', alt: 'Custom wood fence installation by Studio 23' },
  { src: '/client-assets/studio-23/crops/gutter-detail.png', alt: 'Residential gutter detail' },
]

const PROJECT_IMAGES = [
  { src: '/client-assets/studio-23/crops/roof-ridge-wide.png', alt: 'Finished shingle roof ridge' },
  { src: '/client-assets/studio-23/crops/roof-overhead.png', alt: 'Overhead roof project view' },
  { src: '/client-assets/studio-23/crops/active-roof-job.png', alt: 'Residential roofing crew at work' },
  { src: '/client-assets/studio-23/crops/fence-install.png', alt: 'Custom fence installation' },
  { src: '/client-assets/studio-23/crops/gutter-hero-clean.png', alt: 'Gutter system installation detail' },
  { src: '/client-assets/studio-23/crops/tile-roof.png', alt: 'Tile roof project' },
  { src: '/client-assets/studio-23/crops/shingle-roof.png', alt: 'Shingle roof detail' },
  { src: '/client-assets/studio-23/crops/roof-deck.png', alt: 'Roof deck prepared for installation' },
]

const CLAIM_STEPS = [
  {
    step: '01',
    title: 'Inspect',
    body: 'Studio 23 completes a full roof and exterior inspection, including gutters, fence, A/C, and related storm damage.',
  },
  {
    step: '02',
    title: 'File',
    body: 'If hail or wind damage is identified, the team helps file the claim with the insurance company while still on premises.',
  },
  {
    step: '03',
    title: 'Adjuster visit',
    body: 'Within 3-7 days, an adjuster schedules an inspection. Studio 23 makes itself available so all damages are accounted for.',
  },
  {
    step: '04',
    title: 'Selections',
    body: 'After adjuster review, shingle and color selections are finalized and the contract is signed.',
  },
  {
    step: '05',
    title: 'Install',
    body: 'Most roof installations are completed in one day, with related repairs following the roof installation.',
  },
]

const WHY_ITEMS = [
  {
    title: 'Fully insured',
    body: '$1 million standard insurance policy plus additional riders to help ensure full project coverage.',
  },
  {
    title: '100% veteran owned',
    body: 'A business proudly crafted by veteran hands.',
  },
  {
    title: '5 year workmanship warranty',
    body: 'A 5-year craftsmanship guarantee supported by an annual 23-point inspection.',
  },
  {
    title: 'Reduce, reuse, recycle',
    body: 'A commitment to sustainability, efficient roofing materials, and responsible shingle use.',
  },
]

export default function Studio23Page() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171717]">
      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <a href="#top" className="font-serif text-2xl font-semibold tracking-tight no-underline">
            Studio 23
          </a>
          <nav className="hidden items-center gap-7 text-sm uppercase tracking-[0.18em] text-black/55 md:flex">
            <a href="#about" className="hover:text-black">About</a>
            <a href="#services" className="hover:text-black">Services</a>
            <a href="#work" className="hover:text-black">Work</a>
            <a href="/studio-23/agent" className="hover:text-black">Agent</a>
            <a href="#contact" className="hover:text-black">Contact</a>
          </nav>
          <a
            href={`tel:${CONTACT.tel}`}
            className="rounded-full border border-black px-5 py-2 text-sm font-medium no-underline transition hover:bg-black hover:text-white"
          >
            Call now
          </a>
        </div>
      </header>

      <section id="top" className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[0.88fr_1.12fr] md:py-24">
        <div>
          <div className="mb-8 inline-block border-b-2 border-[#d40000] pb-3">
            <p className="text-5xl font-semibold tracking-tight md:text-7xl">Studio 23</p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.34em] text-black/55">
              Roofing and Construction LLC
            </p>
          </div>
          <h1 className="font-serif text-6xl leading-[0.92] tracking-tight md:text-8xl">
            We&apos;ve got you covered
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-black/70">
            Premium roof replacements, repairs, commercial roofing, fencing, gutter systems, and
            claim support for property owners who want transparency at every stage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/studio-23/agent"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white no-underline transition hover:bg-[#d40000]"
            >
              Work with us
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="rounded-full border border-black/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] no-underline transition hover:border-black"
            >
              Email Studio 23
            </a>
          </div>
        </div>
        <div className="grid auto-rows-[230px] gap-4 sm:grid-cols-2 md:auto-rows-[280px]">
          {HERO_IMAGES.map((image, index) => (
            <div
              key={image.src}
              className={[
                'overflow-hidden bg-white shadow-sm',
                index === 0 ? 'sm:row-span-2' : '',
                index === 1 ? 'sm:translate-y-8' : '',
              ].join(' ')}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={640}
                height={820}
                priority={index === 0}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[#171717] px-6 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <h2 className="font-serif text-5xl leading-none tracking-tight md:text-7xl">
            About Studio 23 Roofing and Construction LLC
          </h2>
          <div className="text-lg leading-8 text-white/78">
            <p>
              Studio 23 Roofing and Construction LLC stands ready to address roofing and
              construction requirements. As a 100% veteran-owned roofing company, Studio 23
              specializes in premium roof replacements and repairs for residential, multifamily,
              and commercial projects.
            </p>
            <p className="mt-6">
              The company focuses on keeping property owners well-informed at every stage,
              fostering transparency and trust throughout the process.
            </p>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="text-5xl font-bold tracking-tight md:text-7xl">Our Services</h2>
          <span className="hidden h-px flex-1 bg-black/15 md:block" />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <ServiceBlock
            title="Residential"
            body="Architectural shingles, fiberglass, slate, composite, tile roofing systems, concrete tile, metal roofing systems, asphalt, and slate roofing. Studio 23 offers free roof inspections, upgrades, and storm, wind, or hail damage repairs."
          />
          <ServiceBlock
            title="Commercial"
            body="Flat roof repairs, full reroofing, modified bitumen, TPO, metal, and tile for apartment complexes, office spaces, churches, and more."
          />
          <ServiceBlock
            title="Fencing"
            body="Custom wood fence installation designed to bring warmth, privacy, and natural beauty to outdoor spaces."
          />
          <ServiceBlock
            title="Gutter Systems"
            body="Gutter installation, cleaning, seamless gutter guidance, and gutter guards that help prevent leaks, overflow, water damage, rotting materials, and foundation issues."
          />
        </div>
      </section>

      <section className="bg-[#dededc] px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-5xl leading-none tracking-tight md:text-7xl">
            Insurance Claim Process
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {CLAIM_STEPS.map(item => (
              <div key={item.step} className="rounded-3xl border border-black/25 bg-white/25 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d40000]">
                  Step {item.step}
                </p>
                <h3 className="mt-4 text-2xl font-bold">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-black/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <h2 className="font-serif text-6xl leading-none tracking-tight md:text-8xl">Our Work</h2>
        <div className="mt-10 grid auto-rows-[220px] gap-5 md:grid-cols-4 md:auto-rows-[260px]">
          {PROJECT_IMAGES.map((image, index) => (
            <div
              key={image.src}
              className={[
                'overflow-hidden bg-white shadow-sm',
                index === 2 ? 'md:row-span-2' : '',
                index === 4 ? 'md:col-span-2' : '',
              ].join(' ')}
            >
            <Image
              src={image.src}
              alt={image.alt}
              width={640}
              height={640}
              loading="eager"
              className={image.src.includes('gutter-hero') ? 'h-full w-full object-cover object-left' : 'h-full w-full object-cover'}
            />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-5xl font-bold tracking-tight md:text-7xl">Why work with us</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {WHY_ITEMS.map(item => (
              <div key={item.title} className="border-t-2 border-black pt-5">
                <h3 className="font-serif text-3xl leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-black/68">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#171717] px-6 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="font-serif text-6xl leading-none tracking-tight md:text-8xl">
              We&apos;d love to hear from you
            </h2>
            <div className="mt-5 h-3 max-w-xl bg-[#d40000]" />
          </div>
          <div className="text-xl leading-8">
            <a href={`mailto:${CONTACT.email}`} className="block text-white underline">
              {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.tel}`} className="mt-1 block text-white underline">
              {CONTACT.phone}
            </a>
            <a href="/studio-23/agent" className="mt-1 block text-white underline">
              Request a roof inspection
            </a>
            <address className="mt-4 not-italic text-white/82">
              {CONTACT.address.map(line => <span key={line} className="block">{line}</span>)}
            </address>
          </div>
        </div>
      </section>
    </main>
  )
}

function ServiceBlock({ title, body }: { title: string; body: string }) {
  return (
    <article className="border-l-4 border-[#d40000] bg-white p-7 shadow-sm">
      <h3 className="font-serif text-4xl leading-tight">{title}</h3>
      <p className="mt-4 text-base leading-8 text-black/72">{body}</p>
    </article>
  )
}
