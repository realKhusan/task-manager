"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { TaskStatus } from "@/types/task"
import { statusConfig } from "@/constants/task-status"
export function TaskForm() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isAdd = searchParams.has("add")
  const isEdit = searchParams.has("edit")
  const taskId = searchParams.get("id")
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    status: "new" as TaskStatus,
  })
  const t = useTranslations()

  const closeDialog = () => {
    router.push(pathname)
  }

  return (
    <Dialog open={isAdd || isEdit} onOpenChange={closeDialog}>
      <DialogTrigger asChild onClick={() => { router.push("?add=true") }}>
        <Button size={"lg"} className="rounded-full !bg-indigo-600 dark:text-slate-50" onClick={() => router.push("?add=true")}>
          <Plus className="w-4 h-4 mr-2" />
          {t("newTask")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editTask") : t("addTask")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 *:space-y-2">
          <div>
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t("titlePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="desc">{t("description")}</Label>
            <Textarea
              id="desc"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="status">{t("status")}</Label>
            <Select

              value={formData.status}
              onValueChange={(value: TaskStatus) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent >
                {Object.keys(statusConfig).map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(key as keyof typeof statusConfig)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              {t("cancel")}
            </Button>
            <Button className="flex-1">
              {isEdit ? t("save") : t("add")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
