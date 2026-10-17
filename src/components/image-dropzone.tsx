"use client";

import { useId, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { hasThumb, thumbUrl } from "@/lib/images";
import type { ProjectImage } from "@/lib/types";
import { Icon } from "./icons";
import { Spinner } from "./ui";
import { useToast } from "./toast";

type Uploaded = { url: string };

async function uploadOne(file: File): Promise<Uploaded> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/uploads", { method: "POST", body, credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Upload failed (${res.status})`);
  return data as Uploaded;
}

/**
 * Drag & drop (or click / Enter / Space) image uploader.
 *  - works with the mouse AND the keyboard
 *  - files are optimised on the server (WebP, 1600 px) so pages stay fast
 *  - every image needs alt text: it's an editable field right under the preview
 */
export function ImageDropzone({
  images,
  onChange,
  max = 8,
  single = false,
  label = "Project images",
}: {
  images: ProjectImage[];
  onChange: (next: ProjectImage[]) => void;
  max?: number;
  /** avatar mode: exactly one image, replaced on new upload */
  single?: boolean;
  label?: string;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(0);
  const uid = useId();
  const limit = single ? 1 : max;

  async function handleFiles(list: FileList | File[]) {
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (!files.length) {
      toast({ tone: "error", title: "Only image files are allowed", detail: "Use JPG, PNG, WebP, GIF or AVIF." });
      return;
    }
    const room = single ? 1 : limit - images.length;
    if (room <= 0) {
      toast({ tone: "error", title: `Maximum ${limit} images`, detail: "Remove one to add another." });
      return;
    }
    const batch = files.slice(0, room);
    setBusy((n) => n + batch.length);
    const added: ProjectImage[] = [];
    for (const f of batch) {
      try {
        const r = await uploadOne(f);
        added.push({ url: r.url, alt: "" });
      } catch (err) {
        toast({ tone: "error", title: `Could not upload ${f.name}`, detail: err instanceof Error ? err.message : undefined });
      } finally {
        setBusy((n) => n - 1);
      }
    }
    if (added.length) {
      onChange(single ? added.slice(0, 1) : [...images, ...added]);
      toast({ tone: "success", title: `${added.length} image${added.length > 1 ? "s" : ""} uploaded`, detail: "Don't forget to describe each image in the alt text box." });
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    void handleFiles(e.dataTransfer.files);
  };
  const open = () => inputRef.current?.click();
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= images.length) return;
    const next = images.slice();
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };

  return (
    <div>
      <p id={`${uid}-label`} className="mb-1.5 text-xs font-semibold tracking-wide text-muted">
        {label} <span className="font-normal">({images.length}/{limit})</span>
      </p>

      <div
        role="button"
        tabIndex={0}
        aria-labelledby={`${uid}-label ${uid}-help`}
        onClick={open}
        onKeyDown={onKey}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition",
          over ? "border-accent-400 bg-accent-400/10" : "border-muted/75 bg-canvas/50 hover:border-accent-400",
        )}
      >
        {busy > 0 ? <Spinner className="h-6 w-6 text-accent-300" /> : <Icon name="upload" className="h-6 w-6 text-accent-300" />}
        <p className="text-sm font-semibold text-fg">
          {busy > 0 ? `Uploading ${busy} image${busy > 1 ? "s" : ""}…` : "Drag & drop images here, or press to browse"}
        </p>
        <p id={`${uid}-help`} className="text-xs text-muted">
          JPG, PNG, WebP, GIF or AVIF · up to 12 MB each · optimised automatically
        </p>
      </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={!single}
          tabIndex={-1}
          aria-hidden
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

      {images.length > 0 && (
        <ul className="mt-4 space-y-3">
          {images.map((img, i) => (
            <li key={img.url + i} className="flex gap-3 rounded-xl border border-line bg-surface-2/50 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hasThumb(img.url) ? thumbUrl(img.url) : img.url} alt="" className="h-20 w-28 shrink-0 rounded-lg border border-line object-cover" />
              <div className="min-w-0 flex-1">
                <label htmlFor={`${uid}-alt-${i}`} className="block text-xs font-semibold text-muted">
                  Alt text for image {i + 1} <span className="font-normal">(describe what it shows — read by screen readers)</span>
                </label>
                <input
                  id={`${uid}-alt-${i}`}
                  type="text"
                  value={img.alt}
                  maxLength={200}
                  placeholder="e.g. Dashboard page with a revenue chart and a sidebar menu"
                  onChange={(e) => onChange(images.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))}
                  className="mt-1 w-full rounded-lg border border-muted/70 bg-canvas/70 px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent-400"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {!single && (
                    <>
                      <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:bg-surface-3 hover:text-fg disabled:opacity-40">
                        Move earlier<span className="sr-only"> (image {i + 1})</span>
                      </button>
                      <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:bg-surface-3 hover:text-fg disabled:opacity-40">
                        Move later<span className="sr-only"> (image {i + 1})</span>
                      </button>
                    </>
                  )}
                  <button type="button" onClick={() => onChange(images.filter((_, k) => k !== i))} className="rounded-md px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/10">
                    Remove<span className="sr-only"> image {i + 1}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
