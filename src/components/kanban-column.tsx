"use client"

import { Badge } from "@/components/ui/badge"
import { GripVertical } from "lucide-react"
import { Droppable } from "@hello-pangea/dnd"
import { TaskCard } from "./task-card"
import { useTranslations } from "next-intl"
import { Task, TaskStatus } from "@/types/task"
import { statusConfig } from "@/constants/task-status"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const t = useTranslations()
  const config = statusConfig[status]
  const [isOver, setIsOver] = useState(false);
  return (
    <div className={cn(isOver && "bg-indigo-500/10", "shadow-sm flex flex-col min-h-[550px] max-h-full rounded-4xl border  overflow-hidden")}>
      <div className={`p-4 border  rounded-full ${config.bgColor}`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${config.textColor}`}>{t(status)}</h3>
          <div className="relative">
            <Badge variant="secondary" className={cn(config.color, "rounded-full absolute !-z-10right-0 bottom-0 blur text-white")}>
              {tasks.length}
            </Badge>
            <Badge variant="secondary" className={cn(config.color, "!z-10 rounded-full text-white cursor-pointer ")}>
              {tasks.length}
            </Badge>
          </div>
        </div>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => {
          if (snapshot.isDraggingOver !== isOver) {
            setIsOver(snapshot.isDraggingOver);
          }
          return <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(`p-4 flex-grow-1  transition-colors duration-200`)}
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
              <div className="text-center text-gray-400 py-8 ">
                <GripVertical className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("noTasks")}</p>
                <p className="text-xs mt-1">{t("dragHere")}</p>
              </div>
            )}
          </div>
        }}
      </Droppable>
    </div>
  )
}
