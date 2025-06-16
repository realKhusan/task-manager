"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, MoveRight, MoveLeft } from "lucide-react"
import { Draggable } from "@hello-pangea/dnd"
import { statusConfig } from "../constants/task-status"
import { useTranslations } from "next-intl"
import { Task, TaskStatus } from "@/types/task"
import { useRouter } from "next/navigation"
import { useTaskStore } from "@/store/store"

interface TaskCardProps {
  task: Task
  index: number
}
const indexTask = (status: TaskStatus | string): number => {
  switch (status) {
    case "new":
      return 1;
    case "pending":
      return 2;
    case "done":
      return 3;
    case "failed":
      return 4;
    default:
      return 1;
  }
}

export function TaskCard({ task, index }: TaskCardProps) {
  const router = useRouter()
  const t = useTranslations()
  const moveTask = useTaskStore(state => state.moveTask)
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            hover:shadow-md transition-shadow cursor-grab rounded-4xl active:cursor-grabbing mb-3
            ${snapshot.isDragging ? "shadow-lg rotate-2 opacity-90" : ""}
          `}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-sm font-medium line-clamp-2 flex-1">{task.title}</CardTitle>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`?edit=true&id=${task.id}`)
                  }}
                  title={t("edit")}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`?delete=true&id=${task.id}`)
                  }}
                  title={t("delete")}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {task.desc && <p className="text-xs text-gray-600 mb-3 line-clamp-3">{task.desc}</p>}
            <div className="flex flex-wrap gap-1">
              {Object.entries(statusConfig).map(([newStatus]) => {
                if (newStatus === task.status) return null
                return (
                  <Button
                    key={newStatus}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2 flex rounded-full items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveTask(task.id, newStatus as TaskStatus)
                    }}
                    title={`${t("moveTo")} ${t(newStatus as keyof typeof statusConfig)}`}
                  >
                    {indexTask(newStatus) > indexTask(task.status) ? <MoveRight className="w-3 h-3" /> : <MoveLeft className="w-3 h-3" />}
                    {t(newStatus as keyof typeof statusConfig)}
                  </Button>
                )
              })}
            </div>
            <div className="text-xs text-gray-400 mt-2">{new Date(task.createdAt).toLocaleDateString()}</div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}
