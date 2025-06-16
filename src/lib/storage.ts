import { Task } from "@/types/task";

const STORAGE_KEY = "tasks";

export const getTasks = (): Task[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: Task[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};
export const getTaskById = (id: string): Task | undefined => {
  return getTasks().find((task) => task.id === id);
};
