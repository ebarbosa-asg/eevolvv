import { bookingEmbedSrc, bookingUrl } from "@/lib/seo";

export function BookPanel() {
  const url = bookingUrl();
  const embed = url ? bookingEmbedSrc(url) : "";

  return (
    <div className="book-band" id="book">
      <p className="kicker">// Book</p>
      <h2>Book a 20-minute fit call</h2>
      <p className="lead">
        We’ll look at one episode and tell you straight whether Clip & Ship or Clip & Dominate makes sense.
      </p>
      {url ? (
        <a className="btn btn-primary btn-lg" href={url}>
          Book a fit call →
        </a>
      ) : (
        <p>
          <span className="todo">TODO</span> Booking link
        </p>
      )}
      {embed ? <iframe className="cal-frame" src={embed} title="Book a call with eevolvv" loading="lazy" /> : null}
    </div>
  );
}
