import type { Note } from "../types/Note"
import { NoteCard } from "./NoteCard"
import { AnimatePresence, motion, Reorder } from "framer-motion"

interface NotesListProps {
  notes: Note[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  onReorder: (newOrder: Note[]) => void
  viewMode?: 'grid' | 'list'
}

export function NotesList({
  notes,
  onEdit,
  onDelete,
  onTogglePin,
  onReorder,
  viewMode = 'grid'
}: NotesListProps){
  return (
    <Reorder.Group 
      axis="y" 
      values={notes} 
      onReorder={onReorder} 
      className={viewMode === 'grid' ? "columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4" : "flex flex-col gap-4"}
    >
      <AnimatePresence>
        {notes.map((note) => (
          <Reorder.Item 
            key={note.id} 
            value={note}
            className={viewMode === 'grid' ? "break-inside-avoid" : "w-full"}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          >
            <NoteCard
              note={note}
              onEdit={() => onEdit(note.id)}
              onDelete={() => onDelete(note.id)}
              onTogglePin={() => onTogglePin(note.id)}
            />
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  )
}
