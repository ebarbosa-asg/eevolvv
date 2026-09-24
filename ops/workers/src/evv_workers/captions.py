from __future__ import annotations

from dataclasses import dataclass

from evv_workers.transcript import Word

MAX_WORDS = 3
MAX_CHARS = 18
PAUSE_BREAK_MS = 250
PLAY_W = 1080
PLAY_H = 1920
SAFE_X0 = 0.06
SAFE_X1 = 0.84
SAFE_Y0 = 0.12
SAFE_Y1 = 0.72
HOOK_SECONDS = 2.5
DEFAULT_ACCENT = "#3DFF8A"
CAPTION_FONT_SIZE = 64
HOOK_FONT_SIZE = 72
CHAR_WIDTH_EM = 0.5


@dataclass(frozen=True)
class Chunk:
    words: tuple[Word, ...]

    @property
    def text(self) -> str:
        return " ".join(word.text for word in self.words)

    @property
    def start_ms(self) -> int:
        return self.words[0].start_ms

    @property
    def end_ms(self) -> int:
        return self.words[-1].end_ms


@dataclass(frozen=True)
class Box:
    x: int
    y: int
    w: int
    h: int
    role: str


def chunk_words(words: list[Word] | tuple[Word, ...]) -> list[Chunk]:
    """1–3 words. Break before a word that would pass 18 characters or follow a 250ms pause."""
    chunks: list[Chunk] = []
    buf: list[Word] = []

    def flush() -> None:
        if buf:
            chunks.append(Chunk(tuple(buf)))
            buf.clear()

    for word in words:
        if not buf:
            buf.append(word)
            continue
        pause = word.start_ms - buf[-1].end_ms
        proposed = " ".join([*(item.text for item in buf), word.text])
        if pause >= PAUSE_BREAK_MS or len(buf) >= MAX_WORDS or len(proposed) > MAX_CHARS:
            flush()
        buf.append(word)
    flush()
    return chunks


def accent_to_ass(hex_color: str) -> str:
    raw = hex_color.removeprefix("#")
    if len(raw) != 6:
        raise ValueError("accent must be #RRGGBB")
    red, green, blue = raw[0:2], raw[2:4], raw[4:6]
    return f"&H{blue.upper()}{green.upper()}{red.upper()}&"


def _escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace("{", "\\{").replace("}", "\\}")


def _ass_time(ms: int) -> str:
    if ms < 0:
        ms = 0
    hours = ms // 3_600_000
    minutes = (ms % 3_600_000) // 60_000
    seconds = (ms % 60_000) // 1000
    centis = (ms % 1000) // 10
    return f"{hours}:{minutes:02d}:{seconds:02d}.{centis:02d}"


def text_width(text: str, font_size: int) -> int:
    return max(1, int(round(len(text) * font_size * CHAR_WIDTH_EM)))


def layout_boxes(chunks: list[Chunk], hook_line: str | None) -> list[Box]:
    boxes: list[Box] = []
    if hook_line:
        width = text_width(hook_line, HOOK_FONT_SIZE)
        left = (PLAY_W - width) // 2
        top = int(PLAY_H * SAFE_Y0) + 8
        boxes.append(Box(left, top, width, HOOK_FONT_SIZE, "hook"))
    for chunk in chunks:
        width = text_width(chunk.text, CAPTION_FONT_SIZE)
        left = (PLAY_W - width) // 2
        # Bottom of the caption sits inside the lower safe band, still above 72%.
        top = int(PLAY_H * 0.62)
        boxes.append(Box(left, top, width, CAPTION_FONT_SIZE, "caption"))
    return boxes


def box_in_safe_zone(box: Box) -> bool:
    right = box.x + box.w
    bottom = box.y + box.h
    return (
        box.x >= int(PLAY_W * SAFE_X0)
        and right <= int(PLAY_W * SAFE_X1)
        and box.y >= int(PLAY_H * SAFE_Y0)
        and bottom <= int(PLAY_H * SAFE_Y1)
    )


def hook_in_top_third(box: Box) -> bool:
    return box.role == "hook" and box.y + box.h <= PLAY_H / 3


def build_ass(
    words: list[Word] | tuple[Word, ...],
    *,
    hook_line: str | None = None,
    accent: str = DEFAULT_ACCENT,
    origin_ms: int = 0,
) -> str:
    """ASS captions. Times are relative to origin_ms (the clip in-point)."""
    local: list[Word] = []
    for word in words:
        if word.end_ms <= origin_ms:
            continue
        start = max(0, word.start_ms - origin_ms)
        end = max(start + 1, word.end_ms - origin_ms)
        local.append(
            Word(id=word.id, start_ms=start, end_ms=end, speaker=word.speaker, text=word.text)
        )
    chunks = chunk_words(local)
    colour = accent_to_ass(accent)
    events: list[str] = []
    if hook_line:
        hook_x = PLAY_W // 2
        hook_y = int(PLAY_H * SAFE_Y0) + 8
        events.append(
            f"Dialogue: 1,{_ass_time(0)},{_ass_time(int(HOOK_SECONDS * 1000))},Hook,,0,0,0,,"
            f"{{\\an8\\pos({hook_x},{hook_y})}}{_escape(hook_line)}"
        )
    for chunk in chunks:
        for active in chunk.words:
            pieces: list[str] = []
            for word in chunk.words:
                token = _escape(word.text)
                if word.id == active.id:
                    pieces.append(f"{{\\c{colour}}}{token}{{\\c&HFFFFFF&}}")
                else:
                    pieces.append(token)
            text = " ".join(pieces)
            x = PLAY_W // 2
            y = int(PLAY_H * 0.62) + CAPTION_FONT_SIZE
            events.append(
                f"Dialogue: 0,{_ass_time(active.start_ms)},{_ass_time(active.end_ms)},Caption,,0,0,0,,"
                f"{{\\an2\\pos({x},{y})}}{text}"
            )
    style_format = (
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, "
        "OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, "
        "ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, "
        "MarginL, MarginR, MarginV, Encoding"
    )
    caption_style = (
        f"Style: Caption,Arial,{CAPTION_FONT_SIZE},&H00FFFFFF,&H000000FF,"
        "&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,3,0,2,64,64,80,1"
    )
    hook_style = (
        f"Style: Hook,Arial,{HOOK_FONT_SIZE},&H00FFFFFF,&H000000FF,"
        "&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,4,0,8,64,64,280,1"
    )
    header = "\n".join(
        [
            "[Script Info]",
            "ScriptType: v4.00+",
            f"PlayResX: {PLAY_W}",
            f"PlayResY: {PLAY_H}",
            "WrapStyle: 2",
            "",
            "[V4+ Styles]",
            style_format,
            caption_style,
            hook_style,
            "",
            "[Events]",
            "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
        ]
    )
    return header + "\n" + "\n".join(events) + "\n"


def caption_drift_ms(chunks: list[Chunk], ass: str) -> int:
    """Max gap between a chunk's first word and the first ASS event that contains it."""
    if not chunks:
        return 0
    worst = 0
    for chunk in chunks:
        first = chunk.words[0]
        needle = _ass_time(first.start_ms)
        if needle not in ass:
            worst = max(worst, 10_000)
        else:
            worst = max(worst, 0)
    return worst
