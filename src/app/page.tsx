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
import { useTaskStore } from "@/store/store"
import Loading from "@/components/loading"

function Page() {
  const t = useTranslations();
  const router = useRouter()
  const tasks = useTaskStore((state) => state.tasks)
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
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

    const moveTask = useTaskStore.getState().moveTask
    moveTask(draggableId, destination.droppableId as TaskStatus)
  }
  if (!tasksByStatus) {
    return <Loading />
  }
  return (
    <>
      <div className="!min-h-screen relative p-4">
        <div className="max-w-full mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-3xl font-bold ">{t("taskManager")}</h1>
              <div className="flex gap-3">
                <LanguageToggle />
                <ModeToggle />
              </div>
            </div>
            <div className="flex flex-row gap-3 items-center justify-between">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              <Button size={"lg"} className="rounded-full !px-3  hover:!bg-indigo-700 !bg-indigo-600 dark:text-slate-50" onClick={() => { router.push("?add=true") }}>
                <Plus className="w-4 h-4 md:mr-2" />
                <span className="hidden sm:block">{t("newTask")}</span>
              </Button>
            </div>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="pb-1 overflow-x-auto">
              <div className="grid grid-cols-4 gap-6 min-w-[1400px]">
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