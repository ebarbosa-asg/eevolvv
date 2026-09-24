import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1>That page is not on the lever.</h1>
        <p className="lead">The link is missing. The packages are still here.</p>
        <div className="btn-row">
          <Link className="btn btn-primary" href="/">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
