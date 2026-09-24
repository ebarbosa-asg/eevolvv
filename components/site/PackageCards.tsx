import Link from "next/link";
import { formatUsd, packageList } from "@/lib/packages";

export function PackageCards() {
  return (
    <div className="packages">
      {packageList.map((pack) => {
        const dominate = pack.id === "dominate";
        return (
          <article key={pack.id} className={dominate ? "package-card dominate" : "package-card ship"}>
            <span className={dominate ? "orb orb-red" : "orb orb-blue"} aria-hidden="true" />
            <p className={dominate ? "pill-kicker red" : "pill-kicker blue"}>{dominate ? "Red pill" : "Blue pill"}</p>
            <h3>{pack.name}</h3>
            <p className="price">
              {formatUsd(pack.price)}
              <small>/mo</small>
            </p>
            <ul className="feature-list dots">
              {pack.homeBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <Link className={dominate ? "btn btn-gold" : "btn btn-ship"} href={`/packages/${pack.slug}`}>
              {dominate ? "Choose Dominate" : "Choose Ship"}
            </Link>
          </article>
        );
      })}
    </div>
  );
}
