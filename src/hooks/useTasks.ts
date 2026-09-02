"use client"

import { useState, useEffect } from "react"
import type { Task } from "../types/Task"
import { loadTasks, saveTasks } from "../utils/storage"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())

  // Save tasks whenever they change
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks([newTask, ...tasks])
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const updateTask = (id: string, text: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text } : task)))
  }

  const restoreTasks = (importedTasks: Task[]) => {
    setTasks(importedTasks)
  }

  return { tasks, addTask, deleteTask, toggleTask, updateTask, restoreTasks }
}
