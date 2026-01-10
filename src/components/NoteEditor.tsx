"use client"

import { useState } from "react"
import type { Note } from "../types/Note"
import { Check } from "lucide-react"

interface NoteEditorProps {
  note?: Note
  onSave: (title: string, content: string) => void
  onCancel: () => void
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")

  const handleSave = () => {
    onSave(title, content)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-blue-500">My Notes</h1>
        <button
          onClick={handleSave}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
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
          className="text-3xl font-bold bg-transparent text-white placeholder-gray-400 outline-none mb-2 pb-4 border-b border-gray-600 focus:border-blue-500 transition-colors"
        />

        <label className="text-gray-400 text-sm mb-2 mt-8">Add Notes</label>
        <textarea
          placeholder="Start typing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none resize-none focus:ring-0"
        />
      </div>

      <button onClick={onCancel} className="mt-8 w-full py-3 text-gray-400 hover:text-white transition-colors">
        Cancel
      </button>
    </div>
  )
}
