import Link from "next/link";
import { CheckIcon } from "@/components/site/art";
import { formatUsd, packageList, stripeHref, type PackageId } from "@/lib/packages";

function MiniPhones({ count }: { count: number }) {
  return (
    <div className="mini-phones" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="phone"
          style={{
            width: 42,
            ["--rim" as string]: index % 2 ? "#5AA2FF" : "#3DFF8A",
            ["--tilt" as string]: "0deg",
          }}
        >
          <div className="phone-screen">
            <b />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PackageCards() {
  return (
    <div className="packages">
      {packageList.map((pack) => {
        const href = `/packages/${pack.slug}`;
        const pay = stripeHref(pack.id as PackageId);
        return (
          <article key={pack.id} className={pack.id === "dominate" ? "package-card featured" : "package-card"}>
            {pack.id === "dominate" ? <span className="badge">Most leverage</span> : null}
            <p className="eyebrow">{pack.tier}</p>
            <h3 style={{ fontSize: 32, margin: 0, letterSpacing: "-0.04em" }}>{pack.name}</h3>
            <p className="price">
              {formatUsd(pack.price)} <small>/mo</small>
            </p>
            <MiniPhones count={pack.id === "ship" ? 3 : 5} />
            <p className="muted">{pack.blurb}</p>
            <ul className="feature-list">
              {pack.bullets.map((bullet) => (
                <li key={bullet}>
                  <CheckIcon />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="btn-row">
              <Link className={pack.id === "dominate" ? "btn btn-primary" : "btn btn-secondary"} href={href}>
                See {pack.name}
              </Link>
              {pay ? (
                <a className="btn btn-secondary" href={pay}>
                  Pay {formatUsd(pack.price)}
                </a>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function PillChooser() {
  return (
    <div className="pills">
      <Link className="pill ship" href="/packages/clip-and-ship">
        <span className="pill-orb" aria-hidden="true" />
        <span>
          <strong>Ship</strong>
          <span>{formatUsd(1497)} / mo</span>
        </span>
      </Link>
      <Link className="pill dominate" href="/packages/clip-and-dominate">
        <span className="pill-orb" aria-hidden="true" />
        <span>
          <strong>Dominate</strong>
          <span>{formatUsd(3497)} / mo</span>
        </span>
      </Link>
    </div>
  );
}
