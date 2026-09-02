import { useState } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { ChevronLeft, Plus, Trash2, CheckCircle2, Circle } from "lucide-react"
import { useTasks } from "../hooks/useTasks"
import { ConfirmDialog } from "./ConfirmDialog"

interface TasksDashboardProps {
  onClose: () => void
}

export function TasksDashboard({ onClose }: TasksDashboardProps) {
  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks()
  const [newTaskText, setNewTaskText] = useState("")
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskText.trim()) {
      addTask(newTaskText.trim())
      setNewTaskText("")
    }
  }

  return (
    <div 
      className="h-full bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white flex flex-col transition-colors duration-300"
      style={{
        paddingTop: 'calc(1.5rem + env(safe-area-inset-top))',
        paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))'
      }}
    >
      <div className="flex items-center justify-between px-6 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-blue-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-4xl font-bold text-blue-500">My Tasks</h1>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="px-6 mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!newTaskText.trim()}
          className="bg-blue-500 text-white rounded-xl px-4 py-3 disabled:opacity-50 hover:bg-blue-600 transition-colors"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto px-6 pb-20">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No tasks yet. Create one above!
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={(e, info: PanInfo) => {
                    if (info.offset.x < -100 || info.offset.x > 100) {
                      setTaskToDelete(task.id)
                    }
                  }}
                  className={`bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-3 transition-opacity ${
                    task.completed ? "opacity-60" : "opacity-100"
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0 text-blue-500"
                  >
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <input
                    type="text"
                    value={task.text}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                    className={`flex-1 bg-transparent outline-none ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                  />
                  <button
                    onClick={() => setTaskToDelete(task.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Delete task?"
        description="This task will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onCancel={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) deleteTask(taskToDelete)
          setTaskToDelete(null)
        }}
      />
    </div>
  )
}
