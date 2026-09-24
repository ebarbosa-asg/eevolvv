import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <p className="kicker">ops · intake</p>
      <h1>eevolvv</h1>
      <p>Source upload for client-owned episodes. A file is accepted only after rights are confirmed and ffprobe finds a video stream.</p>
      <p>
        <Link href="/review">Operator review</Link>
      </p>
    </main>
  );
}
