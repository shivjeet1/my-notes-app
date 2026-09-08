import { useState } from "react"
import { motion, AnimatePresence, PanInfo, Reorder } from "framer-motion"
import { ChevronLeft, Plus, Trash2, CheckCircle2, Circle, GripVertical } from "lucide-react"
import { useDragControls } from "framer-motion"
import { useTasks } from "../hooks/useTasks"
import { ConfirmDialog } from "./ConfirmDialog"

interface TasksDashboardProps {
  onClose: () => void
}


const TaskItem = ({ task, toggleTask, updateTask, setTaskToDelete }: any) => {
  const controls = useDragControls()
  return (
    <Reorder.Item
      value={task}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, zIndex: 1, boxShadow: "0 0px 0px 0px rgba(0,0,0,0)" }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      dragListener={false}
      dragControls={controls}
      drag={true}
      whileDrag={{ 
        scale: 1.02, 
        zIndex: 50,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      className={`relative bg-white/50 dark:bg-white/5 p-4 rounded-xl shadow-sm border border-white/40 dark:border-white/10 flex items-center gap-3 transition-opacity ${
        task.completed ? "opacity-60" : "opacity-100"
      }`}
    >
      <div 
        className="cursor-grab active:cursor-grabbing text-gray-400 p-1 -ml-2"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical size={20} />
      </div>
      <button
        onClick={() => toggleTask(task.id)}
        className="flex-shrink-0 text-blue-500"
      >
        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>
      <div className="flex-1 flex flex-col min-w-0">
        <input
          type="text"
          value={task.text}
          onChange={(e) => updateTask(task.id, e.target.value)}
          className={`bg-transparent outline-none w-full truncate ${
            task.completed ? "line-through text-gray-400" : ""
          }`}
        />
        {task.dueDate && (
          <span className={`text-xs mt-1 ${task.completed ? "text-gray-400" : "text-blue-500 dark:text-blue-400"}`}>
            Due: {new Date(task.dueDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        )}
      </div>
      <button
        onClick={() => setTaskToDelete(task.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 size={20} />
      </button>
    </Reorder.Item>
  )
}

export function TasksDashboard({ onClose }: TasksDashboardProps) {
  const { tasks, addTask, toggleTask, deleteTask, updateTask, reorderTasks } = useTasks()
  const [newTaskText, setNewTaskText] = useState("")
  const [newTaskDate, setNewTaskDate] = useState("")
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskText.trim()) {
      addTask(newTaskText.trim(), newTaskDate || undefined)
      setNewTaskText("")
      setNewTaskDate("")
    }
  }

  return (
    <div 
      className="h-full bg-gray-50/80 dark:bg-black/80 backdrop-blur-xl text-gray-900 dark:text-white flex flex-col transition-colors duration-300"
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

      <form onSubmit={handleAddTask} className="px-6 mb-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="flex-1 bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!newTaskText.trim()}
            className="bg-blue-500 text-white rounded-xl px-4 py-3 disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>
        <div className="flex gap-2 items-center text-sm text-gray-500 dark:text-gray-400">
          <input 
            type="datetime-local" 
            value={newTaskDate} 
            onChange={(e) => setNewTaskDate(e.target.value)}
            className="bg-transparent border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 outline-none focus:border-blue-500"
          />
          <span>(Optional) Reminder</span>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto px-6 pb-20">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No tasks yet. Create one above!
          </div>
        ) : (
          <Reorder.Group axis="y" values={tasks} onReorder={reorderTasks} className="space-y-3">
            <AnimatePresence>
              {tasks.map((task) => (
<TaskItem key={task.id} task={task} toggleTask={toggleTask} updateTask={updateTask} setTaskToDelete={setTaskToDelete} />
              ))}
            </AnimatePresence>
          </Reorder.Group>
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
