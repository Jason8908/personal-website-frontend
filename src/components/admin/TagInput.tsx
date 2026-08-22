"use client";

import { useId, useRef, useState } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TagInputProps = {
  id: string;
  value: string[];
  onChange: (next: string[]) => void;
  suggestions?: string[];
  disabled?: boolean;
  placeholder?: string;
  "aria-describedby"?: string;
};

/**
 * Chip editor for short free-text values (skills). Commits on Enter, comma and
 * blur — the blur case matters, otherwise a typed-but-uncommitted value is
 * silently lost when the user goes straight for Save.
 */
export function TagInput({
  id,
  value,
  onChange,
  suggestions = [],
  disabled = false,
  placeholder = "Type and press Enter",
  "aria-describedby": describedBy,
}: TagInputProps) {
  const [buffer, setBuffer] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const listId = useId();

  function commit() {
    const candidate = buffer.trim();
    if (!candidate) return;

    const duplicate = value.some((tag) => tag.toLowerCase() === candidate.toLowerCase());
    if (duplicate) {
      setAnnouncement(`${candidate} is already added`);
      setBuffer("");
      return;
    }

    onChange([...value, candidate]);
    setAnnouncement(`Added ${candidate}`);
    setBuffer("");
  }

  function remove(tag: string) {
    onChange(value.filter((current) => current !== tag));
    setAnnouncement(`Removed ${tag}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
      return;
    }
    if (event.key === "Backspace" && buffer === "" && value.length > 0) {
      event.preventDefault();
      remove(value[value.length - 1]);
      return;
    }
    if (event.key === "Escape" && buffer !== "") {
      // Clear the buffer without letting the Dialog see the Escape.
      event.preventDefault();
      event.stopPropagation();
      setBuffer("");
    }
  }

  const unusedSuggestions = suggestions.filter(
    (suggestion) => !value.some((tag) => tag.toLowerCase() === suggestion.toLowerCase())
  );

  return (
    <div>
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm shadow-xs",
          "focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {value.map((tag) => (
          <Badge key={tag} variant="outline" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              disabled={disabled}
              aria-label={`Remove ${tag}`}
              className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          id={id}
          value={buffer}
          list={unusedSuggestions.length > 0 ? listId : undefined}
          onChange={(event) => setBuffer(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          disabled={disabled}
          placeholder={value.length === 0 ? placeholder : undefined}
          aria-describedby={[describedBy, hintId].filter(Boolean).join(" ")}
          className="min-w-32 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </div>

      {unusedSuggestions.length > 0 && (
        <datalist id={listId}>
          {unusedSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      )}

      <p id={hintId} className="sr-only">
        Press Enter or comma to add. Press Backspace on the empty field to remove the last one.
      </p>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
