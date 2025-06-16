import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useTaskStore } from '@/store/store'
function DeleteAlert() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const t = useTranslations()
    const isDelete = searchParams.has("delete")
    const taskId = searchParams.get("id")
    const deleteTask = useTaskStore((state) => state.deleteTask)
    const closeAlert = () => {
        router.push(pathname)
    }
    const handleSubmit = () => {
        if (taskId) deleteTask(taskId)
    }
    return (
        <AlertDialog open={isDelete} onOpenChange={closeAlert}>
            <AlertDialogContent className="rounded-4xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("deleteTask")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("deleteConfirm")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { router.push(pathname) }}>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} className="bg-red-500 hover:bg-red-600 dark:text-white">
                        {t("delete")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteAlert
