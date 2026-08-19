"use client"

import { useState } from "react"
import { NotesList } from "./components/NotesList"
import { NoteEditor } from "./components/NoteEditor"
import { SearchBar } from "./components/SearchBar"
import { SettingsPanel } from "./components/SettingsPanel"
import { useNotes } from "./hooks/useNotes"
import { Plus, Settings } from "lucide-react"

export default function App() {
  const { notes, addNote, deleteNote, updateNote, togglePin } = useNotes()
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

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
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      {showEditor && (
        <div className="animate-fade-in absolute inset-0 z-10 bg-white dark:bg-black">
          <NoteEditor
            note={editingId ? notes.find((n) => n.id === editingId) : undefined}
            onSave={handleAddNote}
            onCancel={handleCloseEditor}
          />
        </div>
      )}
      <div className={showEditor ? "hidden" : "block animate-fade-in"}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-blue-500">My Notes</h1>
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Settings"
            >
              <Settings size={24} />
            </button>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <div className="px-6 pb-32">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {searchQuery ? "No notes found" : "No notes yet. Create one to get started!"}
            </div>
          ) : (
            <NotesList notes={sortedNotes} onEdit={handleEditNote} onDelete={deleteNote} onTogglePin={togglePin} />
          )}
        </div>

        <button
          onClick={() => setShowEditor(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-transform hover:scale-105 active:scale-95"
          aria-label="Create new note"
        >
          <Plus size={24} />
        </button>
      </div>
      
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  )
}
