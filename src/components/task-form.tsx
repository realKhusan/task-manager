"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { TaskStatus } from "@/types/task"
import { v4 as uuidv4 } from "uuid"
import { statusConfig } from "@/constants/task-status"
import { useTaskStore } from "@/store/store"

export function TaskForm() {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isAdd = searchParams.has("add")
  const isEdit = searchParams.has("edit")
  const taskId = searchParams.get("id")

  const FormSchema = z.object({
    title: z.string().min(1, t("errorTitle")),
    desc: z.string().min(1, t("errorDesc")),
    status: z.enum(["new", "pending", "done", "failed"]),
  })
  type FormData = z.infer<typeof FormSchema>

  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const getTaskById = useTaskStore((state) => state.getTaskById)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      desc: "",
      status: "new",
    },
  })

  useEffect(() => {
    if (isAdd) {
      reset({
        title: "",
        desc: "",
        status: "new",
      })
    }
    else if (isEdit && taskId) {
      const task = getTaskById(taskId)
      if (task) {
        reset({
          title: task.title,
          desc: task.desc,
          status: task.status,
        })
      }
    }

  }, [isEdit, taskId, reset, getTaskById, isAdd])

  const closeDialog = () => {
    router.push(pathname)
  }

  const onSubmit = (data: FormData) => {
    if (isEdit && taskId) {
      updateTask(taskId, data)
    } else {
      addTask({
        id: uuidv4(),
        createdAt: new Date(),
        ...data,
      })
    }
    closeDialog()
  }

  return (
    <Dialog open={isAdd || isEdit} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("editTask") : t("addTask")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 *:space-y-2">
          <div>
            <Label htmlFor="title">{t("title")}</Label>
            <Input id="title" {...register("title")} placeholder={t("titlePlaceholder")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="desc">{t("description")}</Label>
            <Textarea id="desc" {...register("desc")} placeholder={t("descriptionPlaceholder")} rows={3} />
            {errors.desc && <p className="text-sm text-red-500">{errors.desc.message}</p>}
          </div>

          <div>
            <Label htmlFor="status">{t("status")}</Label>
            <Select
              value={watch("status")}
              onValueChange={(value: TaskStatus) =>
                setValue("status", value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(statusConfig).map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(key as keyof typeof statusConfig)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          <div className="flex gap-5 pt-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-full"
              onClick={closeDialog}
              type="button"
            >
              {t("cancel")}
            </Button>
            <Button type="submit" className="flex-1 rounded-full" size="lg">
              {isEdit ? t("save") : t("add")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
