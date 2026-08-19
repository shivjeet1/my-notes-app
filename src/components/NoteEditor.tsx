"use client"

import { useState } from "react"
import type { Note } from "../types/Note"
import { Check, ChevronLeft } from "lucide-react"
import { ConfirmDialog } from "./ConfirmDialog"

interface NoteEditorProps {
  note?: Note
  onSave: (title: string, content: string) => void
  onCancel: () => void
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [confirmCancel, setConfirmCancel] = useState(false)

  const isDirty = title !== (note?.title || "") || content !== (note?.content || "")

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      onCancel()
      return
    }
    onSave(title, content)
  }

  const handleCancelClick = () => {
    if (isDirty) {
      setConfirmCancel(true)
    } else {
      onCancel()
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white p-6 flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCancelClick}
            className="w-10 h-10 rounded-full flex items-center justify-center text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-4xl font-bold text-blue-500">My Notes</h1>
        </div>
        <button
          onClick={handleSave}
          className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          aria-label="Save note"
        >
          <Check size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none mb-2 pb-4 border-b border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-colors"
        />

        <label className="text-gray-500 dark:text-gray-400 text-sm mb-2 mt-8">Add Notes</label>
        <textarea
          placeholder="Start typing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none resize-none focus:ring-0"
        />
      </div>

      <ConfirmDialog
        open={confirmCancel}
        title="Discard changes?"
        description="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard"
        cancelText="Keep editing"
        danger
        onCancel={() => setConfirmCancel(false)}
        onConfirm={() => {
          setConfirmCancel(false)
          onCancel()
        }}
      />
    </div>
  )
}
