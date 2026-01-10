"use client"

import { useState, useEffect } from "react"
import type { Note } from "../types/Note"
import { loadNotes, saveNotes } from "../utils/storage"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])

  // Load notes from storage on mount
  useEffect(() => {
    const loaded = loadNotes()
    setNotes(loaded)
  }, [])

  // Save notes whenever they change
  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  const addNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      pinned: false,
    }
    setNotes([newNote, ...notes])
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const updateNote = (id: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, ...updates } : note)))
  }

  const togglePin = (id: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)))
  }

  return { notes, addNote, deleteNote, updateNote, togglePin }
}
