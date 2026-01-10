"use client"

import { useState } from "react"
import { NotesList } from "./components/NotesList"
import { NoteEditor } from "./components/NoteEditor"
import { SearchBar } from "./components/SearchBar"
import { useNotes } from "./hooks/useNotes"
import { Plus } from "lucide-react"

export default function App() {
  const { notes, addNote, deleteNote, updateNote, togglePin } = useNotes()
  const [searchQuery, setSearchQuery] = useState("")
  const [colorSeed, setColorSeed] = useState(() => Date.now())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned === b.pinned) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return a.pinned ? -1 : 1
  })


  const handleAddNote = (title: string, content: string) => {
    if (editingId) {
      updateNote(editingId, { title, content })
      setEditingId(null)
    } else {
      addNote(title, content)
    }
    setShowEditor(false)
  }

  const handleEditNote = (id: string) => {
    setEditingId(id)
    setShowEditor(true)
  }

  const handleCloseEditor = () => {
    setEditingId(null)
    setShowEditor(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {showEditor ? (
        <NoteEditor
          note={editingId ? notes.find((n) => n.id === editingId) : undefined}
          onSave={handleAddNote}
          onCancel={handleCloseEditor}
        />
      ) : (
        <>
          <div className="p-6">
            <h1 className="text-4xl font-bold mb-6 text-blue-500">My Notes</h1>
              <SearchBar
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value)
                  setColorSeed(Date.now())
                }}
              />
          </div>

          <div className="px-6 pb-32">
            {sortedNotes.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                {searchQuery ? "No notes found" : "No notes yet. Create one to get started!"}
              </div>
            ) : (
              <NotesList notes={sortedNotes} colorSeed={colorSeed} onEdit={handleEditNote} onDelete={deleteNote} onTogglePin={togglePin} />
            )}
          </div>

          <button
            onClick={() => setShowEditor(true)}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={24} />
          </button>
        </>
      )}
    </div>
  )
}
