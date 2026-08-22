"use client";

import { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type BulletPointsEditorProps = {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
};

/**
 * Row editor for sentence-length values (experience bullet points).
 * Blank rows are kept while editing for affordance and stripped on submit by
 * the caller, so there is always at least one visible row.
 */
export function BulletPointsEditor({
  value,
  onChange,
  disabled = false,
}: BulletPointsEditorProps) {
  const rows = value.length > 0 ? value : [""];
  const rowRefs = useRef<Array<HTMLTextAreaElement | null>>([]);

  function focusRow(index: number, caretToEnd = false) {
    // Wait for the new row to render before reaching for it.
    requestAnimationFrame(() => {
      const element = rowRefs.current[index];
      if (!element) return;
      element.focus();
      if (caretToEnd) {
        const end = element.value.length;
        element.setSelectionRange(end, end);
      }
    });
  }

  function setRow(index: number, text: string) {
    const next = [...rows];
    next[index] = text;
    onChange(next);
  }

  function insertBelow(index: number) {
    const next = [...rows];
    next.splice(index + 1, 0, "");
    onChange(next);
    focusRow(index + 1);
  }

  function removeRow(index: number) {
    const next = rows.filter((_, i) => i !== index);
    onChange(next);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>, index: number) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      insertBelow(index);
      return;
    }
    if (event.key === "Backspace" && rows[index] === "" && rows.length > 1) {
      event.preventDefault();
      removeRow(index);
      if (index > 0) focusRow(index - 1, true);
    }
  }

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={index} className="flex items-start gap-2">
          <Textarea
            ref={(element) => {
              rowRefs.current[index] = element;
            }}
            rows={2}
            value={row}
            onChange={(event) => setRow(index, event.target.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            disabled={disabled}
            aria-label={`Bullet point ${index + 1}`}
            placeholder="Describe an accomplishment or responsibility"
            className="min-h-16"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeRow(index)}
            disabled={disabled || rows.length === 1}
            aria-label={`Remove bullet point ${index + 1}`}
            className="mt-1 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => insertBelow(rows.length - 1)}
        disabled={disabled}
        className="border-border bg-transparent hover:bg-foreground/5"
      >
        <Plus />
        Add bullet point
      </Button>
    </div>
  );
}
