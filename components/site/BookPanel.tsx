import Link from "next/link";
import { formatUsd, packageList } from "@/lib/packages";
import { bookingEmbedSrc, bookingUrl, contactEmail } from "@/lib/seo";

export function BookPanel() {
  const url = bookingUrl();
  const embed = url ? bookingEmbedSrc(url) : "";
  const email = contactEmail();

  return (
    <div className="book-band book-card" id="book">
      <p className="kicker">Next</p>
      <h2>Book a 20-minute fit call</h2>
      <p className="lead">
        We’ll look at one episode and tell you straight whether Clip & Ship or Clip & Dominate makes sense.
      </p>
      <ul className="close-prices">
        {packageList.map((pack) => (
          <li key={pack.id}>
            <Link href={`/packages/${pack.slug}`}>
              <span>{pack.name}</span>
              <strong>
                {formatUsd(pack.price)}
                <small>/mo</small>
              </strong>
            </Link>
          </li>
        ))}
      </ul>
      {url ? (
        <a className="btn btn-primary btn-lg" href={url}>
          Book a fit call
        </a>
      ) : (
        <p className="book-todo">
          <span className="todo">TODO</span> Booking link
        </p>
      )}
      <p className="book-mail">
        <a href={`mailto:${email}`}>{email}</a>
      </p>
      {embed ? <iframe className="cal-frame" src={embed} title="Book a call with eevolvv" loading="lazy" /> : null}
    </div>
  );
}
