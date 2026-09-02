import type { Note } from "../types/Note"
import type { Task } from "../types/Task"

const STORAGE_KEY = "notes_app_data"
const TASKS_STORAGE_KEY = "tasks_app_data"

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

export function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    console.error("Failed to load tasks")
    return []
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    console.error("Failed to save tasks")
  }
}
