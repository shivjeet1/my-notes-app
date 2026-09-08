import type { Note } from "../types/Note"
import { NoteCard } from "./NoteCard"
import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion"

interface NotesListProps {
  notes: Note[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  onReorder: (newOrder: Note[]) => void
  viewMode?: 'grid' | 'list'
}


const ReorderableNoteItem = ({ note, viewMode, onEdit, onDelete, onTogglePin }: any) => {
  const controls = useDragControls()
  return (
    <Reorder.Item 
      value={note}
      className={viewMode === 'grid' ? "break-inside-avoid relative" : "w-full relative"}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      dragListener={false}
      dragControls={controls}
      drag={true}
      whileDrag={{ 
        scale: 1.05, 
        rotate: 2,
        zIndex: 50,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
    >
      <NoteCard
        note={note}
        onEdit={() => onEdit(note.id)}
        onDelete={() => onDelete(note.id)}
        onTogglePin={() => onTogglePin(note.id)}
        dragControls={controls}
      />
    </Reorder.Item>
  )
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
<ReorderableNoteItem key={note.id} note={note} viewMode={viewMode} onEdit={onEdit} onDelete={onDelete} onTogglePin={onTogglePin} />
        ))}
      </AnimatePresence>
    </Reorder.Group>
  )
}
