import Link from "next/link";
import { CheckIcon, LeverArt, PhoneWall } from "@/components/site/art";
import { formatUsd, packages, stripeHref, type PackageId } from "@/lib/packages";

export function PackageView({ id }: { id: PackageId }) {
  const pack = packages[id];
  const other = id === "ship" ? packages.dominate : packages.ship;
  const pay = stripeHref(id);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Packages</span>
            <span aria-hidden="true">/</span>
            <span>{pack.name}</span>
          </nav>
          <p className="eyebrow">
            {pack.tier} · {formatUsd(pack.price)}/mo
          </p>
          <h1>{pack.name}</h1>
          <p className="lead">{pack.lead}</p>
          <div className="btn-row">
            <a className="btn btn-primary" href="/#book">
              Book a call
            </a>
            <Link className="btn btn-secondary" href={`/packages/${other.slug}`}>
              Compare {other.name}
            </Link>
            {pay ? (
              <a className="btn btn-secondary" href={pay}>
                Pay {formatUsd(pack.price)}/mo
              </a>
            ) : (
              <span className="todo">Stripe TODO</span>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            {id === "ship" ? <PhoneWall /> : (
              <div className="hero-art" style={{ minHeight: 360 }}>
                <LeverArt />
              </div>
            )}
          </div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>At a glance</h2>
            <table className="compare">
              <tbody>
                <tr>
                  <th scope="row">Price</th>
                  <td>{formatUsd(pack.price)} / mo</td>
                </tr>
                <tr>
                  <th scope="row">Clips</th>
                  <td>{pack.clips}</td>
                </tr>
                <tr>
                  <th scope="row">Platforms</th>
                  <td>{pack.platforms.join(", ")}</td>
                </tr>
                <tr>
                  <th scope="row">Report</th>
                  <td>{pack.report}</td>
                </tr>
                <tr>
                  <th scope="row">Approval</th>
                  <td>You approve everything</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Included</p>
            <h2>What’s in the machine</h2>
          </div>
          <div className="inclusion-grid">
            {pack.included.map((item) => (
              <article key={item.title}>
                <CheckIcon />
                <h3>{item.title}</h3>
                <p className="muted">{item.detail}</p>
              </article>
            ))}
          </div>
          {"notIncluded" in pack && pack.notIncluded ? (
            <p className="honesty" style={{ marginTop: 16 }}>
              <strong>Not included: </strong>
              {pack.notIncluded.join(", ")}.
            </p>
          ) : null}
          {"boostDetail" in pack && pack.boostDetail ? (
            <p className="honesty" style={{ marginTop: 16 }}>
              {pack.boostDetail}
            </p>
          ) : null}
          {"softGuarantee" in pack && pack.softGuarantee ? (
            <div className="guarantee-badge" style={{ marginTop: 16 }}>
              <strong>Soft view guarantee. </strong>
              {pack.softGuarantee}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
