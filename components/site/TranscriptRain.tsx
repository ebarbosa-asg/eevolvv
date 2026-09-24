"use client";

import { useEffect, useRef } from "react";

type Cue = { tc: string; text: string };
type Glyph = { ch: string; x: number; y: number; layer: number; id: number };

function parseCues(source: string): Cue[] {
  return source
    .split("\n")
    .map((line) => {
      const match = line.match(/^(\d{2}:\d{2}:\d{2}\.\d{3})\s+(.+)$/);
      return match ? { tc: match[1], text: match[2] } : null;
    })
    .filter((cue): cue is Cue => Boolean(cue));
}

function layoutGlyphs(cues: Cue[]): { glyphs: Glyph[]; alphabet: string[] } {
  const alphabet: string[] = [];
  const indexOf = (ch: string) => {
    let id = alphabet.indexOf(ch);
    if (id === -1) {
      alphabet.push(ch);
      id = alphabet.length - 1;
    }
    return id;
  };
  const glyphs: Glyph[] = [];
  cues.forEach((cue, line) => {
    const layer = line % 3;
    const col = line % 3;
    const text = `${cue.tc} ${cue.text}`;
    let x = 16 + col * 280;
    const y = 40 + Math.floor(line / 3) * 72;
    for (const ch of text) {
      glyphs.push({ ch, x, y, layer, id: indexOf(ch) });
      x += ch === " " ? 7 : 10 - layer;
    }
  });
  return { glyphs, alphabet };
}

function StaticField({ cues }: { cues: Cue[] }) {
  return (
    <svg className="rain-static" viewBox="0 0 840 280" aria-hidden="true">
      {cues.slice(0, 9).map((cue, index) => (
        <text key={cue.tc} x={16 + (index % 3) * 270} y={36 + Math.floor(index / 3) * 88} fill="#6F8076" fontSize="12" fontFamily="ui-monospace, monospace">
          {`${cue.tc} ${cue.text}`.slice(0, 34)}
        </text>
      ))}
    </svg>
  );
}

export function TranscriptRain({ source }: { source: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const cues = parseCues(source);

  useEffect(() => {
    const host = hostRef.current;
    const parsed = parseCues(source);
    if (!host || parsed.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { glyphs, alphabet } = layoutGlyphs(parsed);
    const canvas = document.createElement("canvas");
    canvas.className = "rain-canvas";
    host.appendChild(canvas);
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: false });
    const ctx2d = gl ? null : canvas.getContext("2d");
    let raf = 0;
    let visible = true;
    let last = 0;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    resize();

    let frame: (time: number) => void = () => {};

    if (gl) {
      const cell = 32;
      const cols = 16;
      const atlas = document.createElement("canvas");
      atlas.width = cols * cell;
      atlas.height = Math.ceil(alphabet.length / cols) * cell;
      const actx = atlas.getContext("2d");
      if (actx) {
        actx.clearRect(0, 0, atlas.width, atlas.height);
        actx.fillStyle = "#E8F0EA";
        actx.font = "20px ui-monospace, monospace";
        actx.textBaseline = "middle";
        alphabet.forEach((ch, index) => {
          const cx = (index % cols) * cell + 6;
          const cy = Math.floor(index / cols) * cell + cell / 2;
          actx.fillText(ch, cx, cy);
        });
      }
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);

      const vs = `#version 300 es
        in vec2 aPos;
        in vec4 aInst;
        uniform vec2 uRes;
        uniform float uTime;
        uniform vec2 uAtlas;
        out vec2 vUv;
        void main() {
          float layer = aInst.z;
          float speed = 20.0 + layer * 18.0;
          float y = mod(aInst.y - uTime * speed, uRes.y + 60.0) - 20.0;
          vec2 pos = vec2(aInst.x * (uRes.x / 840.0), y) + (aPos - 0.5) * (16.0 - layer * 2.0);
          vec2 clip = (pos / uRes) * 2.0 - 1.0;
          gl_Position = vec4(clip.x, -clip.y, layer / 10.0, 1.0);
          float id = aInst.w;
          float col = mod(id, uAtlas.x);
          float row = floor(id / uAtlas.x);
          vUv = (vec2(col, row) + aPos) / uAtlas;
        }`;
      const fs = `#version 300 es
        precision mediump float;
        in vec2 vUv;
        uniform sampler2D uTex;
        out vec4 outColor;
        void main() {
          vec4 tex = texture(uTex, vUv);
          outColor = vec4(tex.rgb, tex.a * 0.72);
        }`;
      const compile = (type: number, src: string) => {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        return shader;
      };
      const program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(program);
      gl.useProgram(program);
      const quad = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      const data = new Float32Array(glyphs.length * 4);
      glyphs.forEach((glyph, index) => {
        data[index * 4] = glyph.x;
        data[index * 4 + 1] = glyph.y + glyph.layer * 18;
        data[index * 4 + 2] = glyph.layer;
        data[index * 4 + 3] = glyph.id;
      });
      const instances = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, instances);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
      gl.vertexAttribDivisor(1, 1);
      const uRes = gl.getUniformLocation(program, "uRes");
      const uTime = gl.getUniformLocation(program, "uTime");
      const uAtlas = gl.getUniformLocation(program, "uAtlas");
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      frame = (time) => {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, time / 1000);
        gl.uniform2f(uAtlas, cols, Math.max(1, Math.ceil(alphabet.length / cols)));
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, glyphs.length);
      };
    } else if (ctx2d) {
      frame = (time) => {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        ctx2d.fillStyle = "#6F8076";
        ctx2d.font = `${12 * Math.min(window.devicePixelRatio || 1, 1.5)}px ui-monospace, monospace`;
        for (const glyph of glyphs) {
          const speed = 20 + glyph.layer * 18;
          const y = ((glyph.y - (time / 1000) * speed) % (canvas.height + 40) + canvas.height + 40) % (canvas.height + 40);
          ctx2d.globalAlpha = 0.45 + glyph.layer * 0.12;
          ctx2d.fillText(glyph.ch, glyph.x, y);
        }
      };
    }

    const loop = (time: number) => {
      if (!visible) return;
      raf = requestAnimationFrame(loop);
      if (time - last < 1000 / 30) return;
      last = time;
      frame(time);
    };
    const setVisible = (next: boolean) => {
      visible = next && document.visibilityState === "visible";
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    };
    const observer = new IntersectionObserver((entries) => setVisible(entries.some((entry) => entry.isIntersecting)));
    observer.observe(host);
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(loop);

    return () => {
      visible = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
  }, [source]);

  return (
    <div className="rain" ref={hostRef} aria-hidden="true">
      <StaticField cues={cues} />
    </div>
  );
}
