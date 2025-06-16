import { create } from "zustand";
import { Task, TaskStatus } from "@/types/task";
import { persist } from "zustand/middleware";

interface TaskStore {
  tasks: Task[];
  getTaskById: (id: string) => Task | undefined;
  addTask: (task: Task) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id);
      },

      addTask: (task) => {
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },

      updateTask: (id, updated) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updated } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      moveTask: (id, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task
          ),
        }));
      },
    }),
    {
      name: "kanban-tasks",
    }
  )
);
