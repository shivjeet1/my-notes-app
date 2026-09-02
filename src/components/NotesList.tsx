import type { Note } from "../types/Note"
import { NoteCard } from "./NoteCard"
import { AnimatePresence, motion } from "framer-motion"

interface NotesListProps {
  notes: Note[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
}

export function NotesList({
  notes,
  onEdit,
  onDelete,
  onTogglePin,
}: NotesListProps){
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
      <AnimatePresence>
        {notes.map((note) => (
          <motion.div 
            key={note.id} 
            className="break-inside-avoid"
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
