"use client"

import { Badge } from "@/components/ui/badge"
import { GripVertical } from "lucide-react"
import { Droppable } from "@hello-pangea/dnd"
import { type Task, type TaskStatus, statusConfig } from "../constants/task-status"
import { TaskCard } from "./task-card"
import { useTranslations } from "next-intl"

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const { t } = useTranslations()
  const config = statusConfig[status]

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className={`p-4 border-b ${config.bgColor}`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${config.textColor}`}>{t(status)}</h3>
          <Badge variant="secondary" className={`${config.color} text-white`}>
            {tasks.length}
          </Badge>
        </div>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 min-h-[400px] transition-colors duration-200 ${snapshot.isDraggingOver ? "bg-gray-50" : ""
              }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <GripVertical className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("noTasks")}</p>
                <p className="text-xs mt-1">{t("dragHere")}</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
