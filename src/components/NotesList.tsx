import type { Note } from "../types/Note"
import { NoteCard } from "./NoteCard"

interface NotesListProps {
  notes: Note[]
  colorSeed: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
}

export function NotesList({
  notes,
  colorSeed,
  onEdit,
  onDelete,
  onTogglePin,
}: NotesListProps){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          colorSeed={colorSeed}
          onEdit={() => onEdit(note.id)}
          onDelete={() => onDelete(note.id)}
          onTogglePin={() => onTogglePin(note.id)}
        />
      ))}
    </div>
  )
}
