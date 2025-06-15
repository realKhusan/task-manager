"use client"

import { useState, useMemo } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Task, TaskStatus } from "@/types/task"
import { TaskForm } from "@/components/task-form"
import { SearchBar } from "@/components/search-bar"
import { LanguageSelector } from "@/components/language-selector"
import { KanbanColumn } from "@/components/kanban-column"
import { mockTasks } from "@/constants/task-status"
import { useTranslations } from "next-intl"

function Page() {
  const t = useTranslations();
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
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

    setTasks(newTasks)
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{t("taskManager")}</h1>
            <LanguageSelector />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <TaskForm />
          </div>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-6 min-w-[1200px]">
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
  )
}

export default Page