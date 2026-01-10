"use client"
import { useState } from "react"
import type { Note } from "../types/Note"
import { getColorForNote } from "../utils/colorPalette"
import { Trash2, Pin } from "lucide-react"
import { ConfirmDialog } from "./ConfirmDialog"


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
const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0)
const [menuOpen, setMenuOpen] = useState(false)
const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)
let pressTimer: ReturnType<typeof setTimeout>
const [confirmDelete, setConfirmDelete] = useState(false)




  return (
  <>
    <div
      className="rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg active:scale-95"
      style={{ backgroundColor: bgColor }}
      onClick={() => {
        setMenuOpen(false)
        onEdit()
      }}

      // DESKTOP: right-click
      onContextMenu={(e) => {
        if (isTouchDevice) return

        e.preventDefault()
        e.stopPropagation()
        setMenuPosition({ x: e.clientX, y: e.clientY })
        setMenuOpen(true)
      }}

      // ANDROID: long-press
      onPointerDown={(e) => {
        if (!isTouchDevice) return

        pressTimer = setTimeout(() => {
          setMenuPosition({ x: e.clientX, y: e.clientY })
          setMenuOpen(true)
        }, 500)
      }}

      onPointerUp={() => {
        if (!isTouchDevice) return
        clearTimeout(pressTimer)
      }}

      onPointerLeave={() => {
        if (!isTouchDevice) return
        clearTimeout(pressTimer)
      }}
    >

      {<div className="flex flex-col gap-2 h-full">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`text-lg font-semibold leading-snug ${textColor} break-words`}
          >
            {note.title?.trim() || "Untitled"}
          </h3>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePin()
            }}
            className={`flex-shrink-0 ${
              note.pinned ? "text-yellow-400" : "opacity-60"
            }`}
            title={note.pinned ? "Unpin note" : "Pin note"}
          >
            <Pin size={16} fill={note.pinned ? "currentColor" : "none"} />
          </button>
        </div>

        {/* BODY */}
        <p
          className={`text-sm ${textColor} opacity-80 break-words line-clamp-4`}
        >
          {note.content?.trim() || "No additional notes"}
        </p>

        {/* FOOTER */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className={`text-xs ${textColor} opacity-60`}>
            {formatDate(note.createdAt)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setConfirmDelete(true)
            }}
            className="opacity-60 hover:opacity-100"
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      }
    </div>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete note?"
        description="This note will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          onDelete()
          setConfirmDelete(false)
        }}
      />

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
            setMenuOpen(false)
            setConfirmDelete(true)
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
