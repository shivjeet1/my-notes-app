"use client"

import { useState, useEffect } from "react"
import { NotesList } from "./components/NotesList"
import { NoteEditor } from "./components/NoteEditor"
import { SearchBar } from "./components/SearchBar"
import { SettingsPanel } from "./components/SettingsPanel"
import { TasksDashboard } from "./components/TasksDashboard"
import { useNotes } from "./hooks/useNotes"
import { Plus, Settings, Book } from "lucide-react"
import { SplashScreen } from "@capacitor/splash-screen"
import { App as CapApp } from "@capacitor/app"
import { AnimatePresence, motion } from "framer-motion"
import { Capacitor } from "@capacitor/core"

export default function App() {
  const { notes, addNote, deleteNote, updateNote, togglePin } = useNotes()
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTasks, setShowTasks] = useState(false)

  useEffect(() => {
    // Hide the splash screen smoothly once the app has mounted
    SplashScreen.hide().catch(() => {});

    // Check for updates
    const checkForUpdate = async () => {
      try {
        if (!Capacitor.isNativePlatform()) return
        
        const info = await CapApp.getInfo()
        
        const res = await fetch("https://raw.githubusercontent.com/Shivjeet1/my-notes-app/master/version.json").catch(() => null)
        if (res && res.ok) {
          const data = await res.json()
          if (data.version && data.version !== info.version) {
            const wantUpdate = window.confirm(`A new version (${data.version}) is available! Would you like to download it?`)
            if (wantUpdate && data.downloadUrl) {
              window.open(data.downloadUrl, "_blank")
            }
          }
        }
      } catch (e) {
        console.warn("Update check failed", e)
      }
    }
    
    checkForUpdate()
  }, [])

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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white transition-colors duration-300 overflow-hidden relative" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-20 bg-gray-50 dark:bg-zinc-950"
          >
            <NoteEditor
              note={editingId ? notes.find((n) => n.id === editingId) : undefined}
              onSave={handleAddNote}
              onCancel={handleCloseEditor}
            />
          </motion.div>
        )}
        {showTasks && (
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-20 bg-gray-50 dark:bg-zinc-950"
          >
            <TasksDashboard onClose={() => setShowTasks(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-screen overflow-y-auto pb-32">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-blue-500">My Notes</h1>
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
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

        <div className="px-6">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {searchQuery ? "No notes found" : "No notes yet. Create one to get started!"}
            </div>
          ) : (
            <NotesList notes={sortedNotes} onEdit={handleEditNote} onDelete={deleteNote} onTogglePin={togglePin} />
          )}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowTasks(true)}
        className="fixed bottom-[7.5rem] right-8 w-16 h-16 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-lg hover:bg-purple-600 z-10"
        aria-label="Open Tasks"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Book size={24} />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowEditor(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 z-10"
        aria-label="Create new note"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Plus size={24} />
      </motion.button>
      
      <AnimatePresence>
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </div>
  )
}
