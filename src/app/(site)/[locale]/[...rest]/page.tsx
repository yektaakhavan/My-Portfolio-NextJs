import { notFound } from "next/navigation";

// Any unknown address inside a language (e.g. /fa/nothing-here) shows the translated 404 page.
export default function CatchAll() {
  notFound();
}
