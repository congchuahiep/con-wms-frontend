import type { ReactNode } from "react";
import { NoteTypeTabs } from "./_components/note-type-tabs";

export default function NotesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <NoteTypeTabs />
      {children}
    </div>
  );
}
