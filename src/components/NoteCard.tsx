"use client"
import { useState } from "react"
import type { Note } from "../types/Note"
import { getColorForNote } from "../utils/colorPalette"
import { Trash2, Pin } from "lucide-react"

interface NoteCardProps {
  note: Note
  colorSeed: number
  onEdit: () => void
  onDelete: () => void
  onTogglePin: () => void
}

export function NoteCard({
  note,
  colorSeed,
  onEdit,
  onDelete,
  onTogglePin,
}: NoteCardProps) {
const bgColor = getColorForNote(note.id, colorSeed)
const textColor = getTextColorForBg(bgColor)
const [menuOpen, setMenuOpen] = useState(false)
const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)


  return (
  <>
    <div
      className="rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg active:scale-95"
      style={{ backgroundColor: bgColor }}
      onClick={() => {
        setMenuOpen(false)
        onEdit()
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()

        setMenuPosition({ x: e.clientX, y: e.clientY })
        setMenuOpen(true)
      }}
    >
      {note.content || "No additional notes"}
    </div>

    {menuOpen && menuPosition && (
      <div
        className="fixed z-50 bg-gray-900 text-white rounded-lg shadow-lg text-sm overflow-hidden"
        style={{
          top: menuPosition.y,
          left: menuPosition.x,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="block w-full px-4 py-2 text-left hover:bg-gray-800"
          onClick={() => {
            onTogglePin()
            setMenuOpen(false)
          }}
        >
          {note.pinned ? "Unpin" : "Pin"}
        </button>

        <button
          className="block w-full px-4 py-2 text-left text-red-400 hover:bg-red-600 hover:text-white"
          onClick={() => {
            const confirmed = window.confirm("Delete this note?")
            if (confirmed) {
              onDelete()
            }
            setMenuOpen(false)
          }}
        >
          Delete
        </button>
      </div>
    )}
  </>
)

}

function getTextColorForBg(bgColor: string): string {
  // Map background colors to appropriate text colors for contrast
  const colorMap: Record<string, string> = {
    "#ff69b4": "text-gray-900",
    "#ffd700": "text-gray-900",
    "#00d9ff": "text-gray-900",
    "#ff8c42": "text-gray-900",
    "#a78bfa": "text-gray-900",
  }
  return colorMap[bgColor] || "text-gray-900"
}

function formatDate(date: string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}
