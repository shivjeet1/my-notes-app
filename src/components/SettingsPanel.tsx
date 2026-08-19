import { X, Moon, Sun, Download, Upload } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { useNotes } from "../hooks/useNotes"
import { useRef } from "react"
import type { Note } from "../types/Note"
import { Capacitor } from "@capacitor/core"
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem"

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { theme, toggleTheme } = useTheme()
  const { notes, restoreNotes } = useNotes()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBackup = async () => {
    try {
      const jsonStr = JSON.stringify(notes, null, 2)
      const fileName = `my-notes-backup-${new Date().toISOString().split('T')[0]}.json`

      if (Capacitor.isNativePlatform()) {
        try {
          const perm = await Filesystem.requestPermissions()
          if (perm.publicStorage !== 'granted') {
             alert("Storage permission is required to save backups.")
             return
          }
        } catch (err) {
          // Some platforms/versions might not support publicStorage permission request
          console.warn("Could not request permissions", err)
        }
        
        await Filesystem.writeFile({
          path: fileName,
          data: jsonStr,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        })
        alert(`Backup saved to Documents folder as ${fileName}`)
      } else {
        const blob = new Blob([jsonStr], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (e) {
      alert("Failed to backup notes: " + e)
    }
  }

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as Note[]
        if (Array.isArray(json) && json.every(n => n.id && typeof n.title === 'string' && typeof n.content === 'string')) {
          restoreNotes(json)
          alert("Notes restored successfully!")
        } else {
          alert("Invalid backup file format.")
        }
      } catch (error) {
        alert("Failed to parse backup file.")
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-full sm:w-[400px] h-[80vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl p-6 flex flex-col shadow-2xl animate-slide-up sm:animate-scale-in text-gray-900 dark:text-white">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8">
          {/* Theme Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Appearance</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Moon size={20} className="text-blue-500" /> : <Sun size={20} className="text-orange-500" />}
                <span className="font-medium">Dark Mode</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-colors relative ${theme === "dark" ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${theme === "dark" ? "left-7" : "left-1"}`} />
              </button>
            </div>
          </section>

          {/* Backup/Restore Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Data Management</h3>
            <div className="space-y-3">
              <button
                onClick={handleBackup}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Download size={20} className="text-green-500" />
                <div className="text-left">
                  <div className="font-medium">Backup Notes</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Save your notes to a JSON file</div>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Upload size={20} className="text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Restore Notes</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Import notes from a backup file</div>
                </div>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleRestore}
                accept="application/json"
                className="hidden"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
