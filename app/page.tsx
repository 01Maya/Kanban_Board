"use client"

import { useState } from "react"
import { KanbanBoard } from "@/components/kanban-board"

export interface Task {
  id: string
  title: string
  description?: string
  colorTag: string
  columnId: string
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "1",
        title: "Design homepage mockup",
        description: "Create wireframes and visual design for the new homepage layout",
        colorTag: "blue",
        columnId: "todo",
      },
      {
        id: "2",
        title: "Set up project repository",
        description: "Initialize Git repo and configure CI/CD pipeline",
        colorTag: "green",
        columnId: "todo",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "3",
        title: "Implement user authentication",
        description: "Add login/signup functionality with JWT tokens",
        colorTag: "orange",
        columnId: "in-progress",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "4",
        title: "Research competitor analysis",
        description: "Analyze top 5 competitors and document findings",
        colorTag: "green",
        columnId: "done",
      },
    ],
  },
]

export default function HomePage() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)

  return (
    <main className="min-h-screen bg-background p-4 md:p-6 relative">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Kanban Board</h1>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">
            Organize your tasks and track progress efficiently
          </p>
        </header>

        <KanbanBoard columns={columns} onColumnsChange={setColumns} />
      </div>
    </main>
  )
}
