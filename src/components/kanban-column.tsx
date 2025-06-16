"use client"

import { Badge } from "@/components/ui/badge"
import { GripVertical } from "lucide-react"
import { Droppable } from "@hello-pangea/dnd"
import { TaskCard } from "./task-card"
import { useTranslations } from "next-intl"
import { Task, TaskStatus } from "@/types/task"
import { statusConfig } from "@/constants/task-status"

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const t = useTranslations()
  const config = statusConfig[status]

  return (
    <div className=" shadow-sm  rounded-4xl border">
      <div className={`p-4 border sticky bg-opacity-55  dark:backdrop-blur dark:backdrop-opacity-80 animation-duration-initial top-0 rounded-full ${config.bgColor}`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${config.textColor}`}>{t(status)}</h3>
          <div className="relative">
            <Badge variant="secondary" className={`${config.color} rounded-full absolute right-0 bottom-0 blur text-white`}>
              {tasks.length}
            </Badge>
            <Badge variant="secondary" className={`${config.color} hover:!scale-105 cursor-pointer rounded-full text-white`}>
              {tasks.length}
            </Badge>
          </div>
        </div>
      </div>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 min-h-[400px] transition-colors duration-200`}
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
