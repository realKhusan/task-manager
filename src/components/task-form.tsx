"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter, useSearchParams } from "next/navigation"
export function TaskForm() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const isAdd = searchParams.has("add")
  const isEdit = searchParams.has("edit")
  const { t } = useTranslations()

  return (
    <Dialog open={isAdd || isEdit} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t("newTask")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editTask") : t("addTask")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
              placeholder={t("titlePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="desc">{t("description")}</Label>
            <Textarea
              id="desc"
              value={formData.desc}
              onChange={(e) => onFormDataChange({ ...formData, desc: e.target.value })}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="status">{t("status")}</Label>
            <Select
              value={formData.status}
              onValueChange={(value: TaskStatus) => onFormDataChange({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(statusConfig).map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(key as keyof typeof statusConfig)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              {t("cancel")}
            </Button>
            <Button onClick={onSubmit} className="flex-1">
              {isEdit ? t("save") : t("add")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
