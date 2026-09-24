const LETTERS = ["e", "e", "v", "o", "l", "v", "v"] as const;

export function Wordmark() {
  return (
    <span className="wordmark" aria-hidden="true">
      {LETTERS.map((letter, index) => (
        <span className={index === 3 ? "wordmark-o" : "wordmark-ch"} key={`${letter}-${index}`} data-tip={index % 2 === 0 ? "-3" : "3"}>
          {letter}
          {index === 3 ? <span className="fulcrum" /> : null}
        </span>
      ))}
    </span>
  );
}
