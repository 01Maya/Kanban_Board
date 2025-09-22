"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Column, Task } from "@/app/page"
import { TaskCard } from "./task-card"
import { AddTaskForm } from "./add-task-form"

interface KanbanColumnProps {
  column: Column
  onAddTask: (task: Omit<Task, "id" | "columnId">) => void
  onDeleteTask: (taskId: string) => void
  onUpdateTask: (taskId: string, updatedTask: Partial<Task>) => void
  onDragStart: (task: Task) => void
  onDragEnd: () => void
  onDrop: (columnId: string, targetIndex?: number) => void
  draggedTask: Task | null
}

export function KanbanColumn({
  column,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedTask,
}: KanbanColumnProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedTask) return

    setIsDragOver(true)

    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const headerHeight = 80 // Approximate header height
    const adjustedY = Math.max(0, y - headerHeight)
    const cardHeight = 120 // Approximate card height including spacing
    const index = Math.floor(adjustedY / cardHeight)
    setDropIndex(Math.min(Math.max(0, index), column.tasks.length))
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false)
      setDropIndex(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(column.id, dropIndex ?? undefined)
    setDropIndex(null)
  }

  return (
    <Card
      className={`flex flex-col h-fit min-h-[500px] bg-card border-border transition-all duration-200 ${
        isDragOver ? "border-blue-400 border-2 bg-blue-50/10 shadow-lg" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-card-foreground">
          <span>{column.title}</span>
          <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {column.tasks.length}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {isDragOver && dropIndex === 0 && draggedTask && (
          <div className="h-1 bg-blue-400 rounded-full mb-2 transition-all duration-200 shadow-sm" />
        )}

        {column.tasks.map((task, index) => (
          <div key={task.id}>
            <TaskCard
              task={task}
              onDelete={onDeleteTask}
              onUpdate={onUpdateTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggedTask?.id === task.id}
            />
            {isDragOver && dropIndex === index + 1 && draggedTask && (
              <div className="h-1 bg-blue-400 rounded-full mt-2 transition-all duration-200 shadow-sm" />
            )}
          </div>
        ))}

        {showAddForm ? (
          <AddTaskForm
            onSubmit={(task) => {
              onAddTask(task)
              setShowAddForm(false)
            }}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 border-2 border-dashed border-border hover:border-accent/50 transition-colors"
            onClick={() => setShowAddForm(true)}
          >
            <span className="mr-2">+</span>
            Add Task
          </Button>
        )}
      </CardContent>
    </Card>
  )
}