"use client"

import { useState } from "react"
import type { Note } from "../types/Note"
import { Check, ChevronLeft } from "lucide-react"
import { ConfirmDialog } from "./ConfirmDialog"
import ReactMarkdown from "react-markdown"

interface NoteEditorProps {
  note?: Note
  onSave: (title: string, content: string, color?: string) => void
  onCancel: () => void
}


const PRESET_COLORS = [
  "",
  "#fecaca",
  "#fde047",
  "#86efac",
  "#93c5fd",
  "#c4b5fd",
  "#f9a8d4",
]

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [color, setColor] = useState(note?.color || "")
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  const isDirty = title !== (note?.title || "") || content !== (note?.content || "") || color !== (note?.color || "")

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      onCancel()
      return
    }
    onSave(title, content, color || undefined)
  }

  const handleCancelClick = () => {
    if (isDirty) {
      setConfirmCancel(true)
    } else {
      onCancel()
    }
  }

  return (
    <div 
      className="h-full bg-gray-50/80 dark:bg-black/80 backdrop-blur-xl text-gray-900 dark:text-white p-6 flex flex-col transition-colors duration-300"
      style={{
        paddingTop: 'calc(1.5rem + env(safe-area-inset-top))',
        paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))'
      }}
    >
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

        
        <div className="flex items-center gap-3 mb-4 overflow-x-auto py-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c || "default"}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full flex-shrink-0 border-2 transition-transform ${color === c ? 'scale-110 border-blue-500' : 'border-transparent dark:border-white/10 shadow-sm'}`}
              style={{ 
                backgroundColor: c || 'transparent', 
                border: !c && color !== c ? '2px dashed gray' : undefined 
              }}
              title={c ? "Custom color" : "Default auto color"}
              aria-label={c ? `Color ${c}` : "Default color"}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 mb-2">
          <label className="text-gray-500 dark:text-gray-400 text-sm">Add Notes (Markdown Supported)</label>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
          >
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>
        {isPreview ? (
          <div className="flex-1 overflow-y-auto bg-transparent text-gray-900 dark:text-white prose dark:prose-invert max-w-none">
            <ReactMarkdown>{content || "*No content*"}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            placeholder="Start typing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none resize-none focus:ring-0"
          />
        )}
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
