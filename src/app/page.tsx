"use client"

import { useState, useMemo } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Task, TaskStatus } from "@/types/task"
import { TaskForm } from "@/components/task-form"
import { SearchBar } from "@/components/search-bar"
import LanguageToggle from "@/components/language-selector"
import { KanbanColumn } from "@/components/kanban-column"
import { useTranslations } from "next-intl"
import { ModeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import DeleteAlert from "@/components/task-delete-alert"
import { getTasks, saveTasks } from "@/lib/storage"

function Page() {
  const t = useTranslations();
  const router = useRouter()
  const tasks = getTasks()

  const [searchTerm, setSearchTerm] = useState("")
  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.desc.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [tasks, searchTerm])

  // Status bo'yicha tasklarni guruhlash
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      new: [],
      pending: [],
      done: [],
      failed: [],
    }

    filteredTasks.forEach((task) => {
      grouped[task.status].push(task)
    })

    return grouped
  }, [filteredTasks])

  // Drag and Drop handler
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const destStatus = destination.droppableId as TaskStatus

    const newTasks = Array.from(tasks)
    const draggedTaskIndex = newTasks.findIndex((task) => task.id === draggableId)
    const draggedTask = newTasks[draggedTaskIndex]

    newTasks.splice(draggedTaskIndex, 1)
    const updatedTask = { ...draggedTask, status: destStatus }
    const destTasks = newTasks.filter((task) => task.status === destStatus)

    const insertIndex = newTasks.findIndex((task) => {
      if (task.status === destStatus) {
        const destIndex = destTasks.findIndex((t) => t.id === task.id)
        return destIndex >= destination.index
      }
      return false
    })

    if (insertIndex === -1) {
      newTasks.push(updatedTask)
    } else {
      newTasks.splice(insertIndex, 0, updatedTask)
    }
    saveTasks(newTasks)
  }
  return (
    <><div className="min-h-screen  p-4">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-3xl font-bold ">{t("taskManager")}</h1>
            <div className="flex gap-3">
              <LanguageToggle />
              <ModeToggle />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <Button size={"lg"} className="rounded-full  hover:!bg-indigo-700 !bg-indigo-600 dark:text-slate-50" onClick={() => { router.push("?add=true") }}>
              <Plus className="w-4 h-4 mr-2" />
              {t("newTask")}
            </Button>
          </div>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-6 min-w-[1200px] overflow-x-hidden">
              {(Object.keys(tasksByStatus) as TaskStatus[]).map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={tasksByStatus[status]}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
      <TaskForm />
      <DeleteAlert />
    </>
  )
}

export default Page