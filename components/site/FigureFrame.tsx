export function FigureFrame({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <figure className="fig">
      <figcaption className="fig-label">FIG. {n}</figcaption>
      {children}
    </figure>
  );
}
