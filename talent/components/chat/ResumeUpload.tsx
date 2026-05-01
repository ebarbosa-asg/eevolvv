"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ResumeUploadProps {
  onFile: (file: File) => void;
  onText: (text: string) => void;
}

export function ResumeUpload({ onFile, onText }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<"upload" | "text">("upload");
  const [textValue, setTextValue] = useState("");

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["upload", "text"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              mode === m
                ? "bg-cyan-500 text-white"
                : "border border-cyan-200/80 text-slate-500 hover:border-cyan-300"
            )}
          >
            {m === "upload" ? "Upload resume" : "Paste or type"}
          </button>
        ))}
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8",
            "transition-colors duration-150",
            dragging
              ? "border-cyan-400 bg-cyan-50/60"
              : "border-cyan-200/60 bg-white/60 hover:border-cyan-300 hover:bg-white/80"
          )}
        >
          <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm text-slate-600">
            Drop your resume here or <span className="font-semibold text-cyan-600">browse</span>
          </p>
          <p className="text-xs text-slate-400">PDF or text file</p>
          <input ref={inputRef} type="file" accept=".pdf,.txt" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Paste your resume text, LinkedIn about section, or just tell us what you do..."
            rows={5}
            className="w-full resize-none rounded-2xl border border-cyan-200/80 bg-white/90 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/25"
          />
          <button
            type="button"
            onClick={() => { if (textValue.trim()) onText(textValue); }}
            disabled={!textValue.trim()}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-2 text-sm font-bold text-white shadow-md shadow-cyan-500/25 transition hover:scale-[1.02] disabled:opacity-40"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
