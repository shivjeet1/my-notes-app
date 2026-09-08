import { useState, useEffect } from "react"
import type { Task } from "../types/Task"
import { loadTasks, saveTasks } from "../utils/storage"
import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const scheduleNotification = async (task: Task) => {
    if (!task.dueDate || !Capacitor.isNativePlatform()) return
    try {
      const perm = await LocalNotifications.requestPermissions()
      if (perm.display !== 'granted') return
      
      const numericId = Number(task.id) % 2147483647
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Task Reminder",
            body: task.text,
            id: numericId,
            schedule: { at: new Date(task.dueDate) },
          }
        ]
      })
    } catch (e) {
      console.warn("Could not schedule notification", e)
    }
  }

  const cancelNotification = async (task: Task) => {
    if (!task.dueDate || !Capacitor.isNativePlatform()) return
    try {
      const numericId = Number(task.id) % 2147483647
      await LocalNotifications.cancel({ notifications: [{ id: numericId }] })
    } catch (e) {
      console.warn("Could not cancel notification", e)
    }
  }

  const addTask = (text: string, dueDate?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
    }
    setTasks(prev => [newTask, ...prev])
    if (dueDate) scheduleNotification(newTask)
  }

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (task) cancelNotification(task)
    setTasks(prev => prev.filter((t) => t.id !== id))
  }

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map((task) => {
      if (task.id === id) {
        if (!task.completed) {
           cancelNotification(task)
        } else {
           if (new Date(task.dueDate || 0) > new Date()) scheduleNotification(task)
        }
        return { ...task, completed: !task.completed }
      }
      return task
    }))
  }

  const updateTask = (id: string, text: string) => {
    setTasks(prev => prev.map((task) => (task.id === id ? { ...task, text } : task)))
  }

  const reorderTasks = (newOrder: Task[]) => { setTasks(newOrder) }
  return { tasks, addTask, deleteTask, toggleTask, updateTask, reorderTasks }
}
