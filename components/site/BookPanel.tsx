import { bookingEmbedSrc, bookingUrl } from "@/lib/seo";

export function BookPanel() {
  const url = bookingUrl();
  const embed = url ? bookingEmbedSrc(url) : "";

  return (
    <div className="book-card" id="book">
      <p className="eyebrow">Next step</p>
      <h2>Book a 20-minute fit call</h2>
      <p className="lead">
        We’ll look at one episode and tell you straight whether Clip & Ship or Clip & Dominate makes sense—or if you should just use a low-cost tool.
      </p>
      {url ? (
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <a className="btn btn-primary" href={url}>
            Open booking
          </a>
        </div>
      ) : (
        <p>
          <span className="todo">TODO</span> Booking link
        </p>
      )}
      {embed ? (
        <iframe className="cal-frame" src={embed} title="Book a call with eevolvv" loading="lazy" />
      ) : null}
    </div>
  );
}
