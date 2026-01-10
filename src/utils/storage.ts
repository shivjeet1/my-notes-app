import type { Note } from "../types/Note"

const STORAGE_KEY = "notes_app_data"

export function loadNotes(): Note[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    console.error("Failed to load notes")
    return []
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    console.error("Failed to save notes")
  }
}
