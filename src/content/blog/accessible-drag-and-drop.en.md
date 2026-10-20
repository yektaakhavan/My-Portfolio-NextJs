Reordering a list with the mouse is easy to build and easy to love. It is also impossible for anyone who can't use a mouse. For the admin panel of this site I wanted to reorder projects and skills by dragging, without leaving keyboard users behind.

## Start with a handle that is a button

The part you grab is a real `<button>` with a clear name such as "Reorder Coffee Listing". Because it is a button, it can be reached with Tab, announced by screen readers and pressed with Space.

## Use a library that already solved the hard parts

I used **dnd-kit**. It ships a pointer sensor (mouse and touch) and a keyboard sensor, so the same list works three ways:

- **Mouse and touch:** drag the handle.
- **Keyboard:** focus the handle, press **Space** to pick up, move with the **arrow keys**, press **Space** to drop, **Escape** to cancel.

```tsx
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
);
```

The small `distance` constraint stops a normal click from being treated as the start of a drag.

## Say what is happening

Sighted users see the item move. Screen reader users need words, so I wrote announcements like "Picked up Teamwork. Position 3 of 12." and "Dropped Teamwork at position 1 of 12."

## Save the order simply and safely

When the list changes, I send **one request** with the ids in their new order. The server checks that they are unique whole numbers, then writes the positions in a single transaction.

On the client the list updates immediately (an optimistic update). If the request fails, it **rolls back** and shows an error, so the screen never claims something the database doesn't know.

## What I learned

- Build the keyboard path first; the mouse path is the easy part.
- A drag handle is a control, so it needs a name.
- Validate the order on the server. Never trust that the ids sent by the browser are the ones you expect.
