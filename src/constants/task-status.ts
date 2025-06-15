import { Task } from "@/types/task";

export const statusConfig = {
  new: {
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  pending: {
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
  },
  done: {
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
  },
  failed: {
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
  },
};

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Loyiha rejasini tayyorlash",
    desc: "Yangi loyiha uchun batafsil reja tuzish va vaqt jadvalini belgilash",
    status: "new",
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Dizayn maketi yaratish",
    desc: "Foydalanuvchi interfeysi uchun dizayn maketi tayyorlash",
    status: "pending",
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Ma'lumotlar bazasini sozlash",
    desc: "Loyiha uchun ma'lumotlar bazasi strukturasini yaratish",
    status: "done",
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "API endpointlarini yaratish",
    desc: "Backend uchun REST API endpointlarini ishlab chiqish",
    status: "new",
    createdAt: new Date(),
  },
  {
    id: "5",
    title: "Frontend komponentlarini kodlash",
    desc: "React komponentlarini yaratish va stilizatsiya qilish",
    status: "pending",
    createdAt: new Date(),
  },
];
