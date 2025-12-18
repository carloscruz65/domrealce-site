import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";

export type SelectedFile = {
  file: File;
  originalName: string;
  size: number;
  type: string;
};

interface ObjectUploaderProps {
  onUpload: (files: SelectedFile[]) => void;
  maxFiles?: number;
  maxFileSizeMb?: number; // default 10MB
  acceptedTypes?: string[]; // ex: ["image/*", ".pdf", ".ai", ".svg", ".tif", ".tiff"]
  className?: string;
  buttonLabel?: string;
}

function matchesAccept(file: File, acceptList: string[]) {
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();

  return acceptList.some((acc) => {
    const a = acc.toLowerCase().trim();

    // image/*, video/*, etc
    if (a.endsWith("/*")) {
      const prefix = a.replace("/*", "");
      return type.startsWith(prefix + "/");
    }

    // .pdf, .ai, .svg, ...
    if (a.startsWith(".")) {
      return name.endsWith(a);
    }

    // mime type exact
    return type === a;
  });
}

/**
 * ObjectUploader (simple)
 * - only selects files
 * - validates quantity/types/size
 * - returns files to parent via onUpload
 * - does NOT upload anything by itself
 */
export function ObjectUploader({
  onUpload,
  maxFiles = 3,
  maxFileSizeMb = 10,
  acceptedTypes = ["image/*", ".pdf", ".ai", ".svg", ".tif", ".tiff", ".jpg", ".jpeg", ".png"],
  className = "",
  buttonLabel = "Anexar Ficheiros",
}: ObjectUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<SelectedFile[]>([]);
  const maxBytes = useMemo(() => maxFileSizeMb * 1024 * 1024, [maxFileSizeMb]);
  const acceptAttr = useMemo(() => acceptedTypes.join(","), [acceptedTypes]);

  function sync(next: SelectedFile[]) {
    setSelected(next);
    onUpload(next);
  }

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const incoming = Array.from(files);

    // Limit total files
    const slots = Math.max(0, maxFiles - selected.length);
    const batch = incoming.slice(0, slots);

    const valid: SelectedFile[] = [];
    for (const f of batch) {
      if (f.size > maxBytes) continue;
      if (acceptedTypes.length && !matchesAccept(f, acceptedTypes)) continue;

      valid.push({
        file: f,
        originalName: f.name,
        size: f.size,
        type: f.type,
      });
    }

    sync([...selected, ...valid]);

    // reset input so the same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    const next = selected.filter((_, i) => i !== index);
    sync(next);
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptAttr}
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black"
      >
        <Upload className="w-4 h-4 mr-2" />
        {buttonLabel}
      </Button>

      {selected.length > 0 && (
        <div className="mt-3 space-y-2">
          {selected.map((f, idx) => (
            <div
              key={`${f.originalName}-${idx}`}
              className="flex items-center justify-between bg-gray-800/30 p-2 rounded border border-white/10"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-brand-turquoise shrink-0" />
                <span className="text-white/80 text-sm truncate">{f.originalName}</span>
                <span className="text-white/40 text-xs shrink-0">
                  ({(f.size / 1024).toFixed(1)} KB)
                </span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAt(idx)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                aria-label="Remover ficheiro"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <p className="text-xs text-white/50">
            {selected.length}/{maxFiles} ficheiros
          </p>
        </div>
      )}
    </div>
  );
}
