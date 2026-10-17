"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";

type Item = { id: number };

/**
 * Drag & drop reordering that also works with the keyboard and screen readers:
 *   focus the grip button → Space to pick up → ↑ ↓ ← → to move → Space to drop (Esc cancels).
 * The mouse/touch version works by dragging the grip button.
 */
export function SortableList<T extends Item>({
  items,
  onReorder,
  getLabel,
  layout,
  className,
  renderItem,
}: {
  items: T[];
  /** called with the new order after a drop */
  onReorder: (next: T[]) => void;
  /** human name of an item, used in screen-reader announcements and the button label */
  getLabel: (item: T) => string;
  layout: "list" | "grid";
  className?: string;
  renderItem: (item: T, handle: ReactNode) => ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const nameOf = (id: string | number) => {
    const it = items.find((x) => x.id === id);
    return it ? getLabel(it) : "item";
  };
  const posOf = (id: string | number) => items.findIndex((x) => x.id === id) + 1;

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${nameOf(active.id)}. Position ${posOf(active.id)} of ${items.length}.`,
    onDragOver: ({ active, over }) =>
      over ? `${nameOf(active.id)} is now over position ${posOf(over.id)} of ${items.length}.` : `${nameOf(active.id)} is not over a position.`,
    onDragEnd: ({ active, over }) =>
      over ? `Dropped ${nameOf(active.id)} at position ${posOf(over.id)} of ${items.length}.` : `Dropped ${nameOf(active.id)}. Order unchanged.`,
    onDragCancel: ({ active }) => `Cancelled. ${nameOf(active.id)} returned to position ${posOf(active.id)}.`,
  };

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((x) => x.id === active.id);
    const to = items.findIndex((x) => x.id === over.id);
    if (from < 0 || to < 0) return;
    onReorder(arrayMove(items, from, to));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable:
            "To pick up an item, press Space or Enter. Use the arrow keys to move it, then press Space or Enter again to drop it. Press Escape to cancel.",
        },
      }}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}>
        <ul className={className}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id} label={getLabel(item)}>
              {(handle) => renderItem(item, handle)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, label, children }: { id: number; label: string; children: (handle: ReactNode) => ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label={`Reorder ${label}`}
      title="Drag to reorder"
      className="inline-flex h-9 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-accent-300 active:cursor-grabbing"
    >
      <Icon name="grip" className="h-5 w-5" />
    </button>
  );
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("relative list-none", isDragging && "z-20 opacity-90 shadow-2xl ring-2 ring-accent-400")}
    >
      {children(handle)}
    </li>
  );
}
