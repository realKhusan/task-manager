"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, MoveRight } from "lucide-react"
import { Draggable } from "@hello-pangea/dnd"
import { type Task, type TaskStatus, statusConfig } from "../constants/task-status"
import { useTranslations } from "next-intl"

interface TaskCardProps {
  task: Task
  index: number
}

export function TaskCard({ task, index }: TaskCardProps) {
  const { t } = useTranslations()

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-3
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
                    onEdit(task)
                  }}
                  title={t("edit")}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-700"
                      onClick={(e) => e.stopPropagation()}
                      title={t("delete")}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("deleteTask")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("deleteConfirm").replace("bu taskini", `"${task.title}" taskini`)}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(task.id)} className="bg-red-500 hover:bg-red-600">
                        {t("delete")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {task.desc && <p className="text-xs text-gray-600 mb-3 line-clamp-3">{task.desc}</p>}
            <div className="flex flex-wrap gap-1">
              {Object.entries(statusConfig).map(([newStatus, newConfig]) => {
                if (newStatus === task.status) return null
                return (
                  <Button
                    key={newStatus}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2 flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onStatusChange(task.id, newStatus as TaskStatus)
                    }}
                    title={`${t("moveTo")} ${t(newStatus as keyof typeof statusConfig)}`}
                  >
                    <MoveRight className="w-3 h-3" />
                    {t(newStatus as keyof typeof statusConfig)}
                  </Button>
                )
              })}
            </div>
            <div className="text-xs text-gray-400 mt-2">{task.createdAt.toLocaleDateString()}</div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}
