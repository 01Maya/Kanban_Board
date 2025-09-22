"use client"

import { useState } from "react"
import type { Column, Task } from "@/app/page"
import { KanbanColumn } from "./kanban-column"
import { TrashZone } from "./trash-zone"

interface KanbanBoardProps {
  columns: Column[]
  onColumnsChange: (columns: Column[]) => void
}

export function KanbanBoard({ columns, onColumnsChange }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const addTask = (columnId: string, task: Omit<Task, "id" | "columnId">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      columnId,
    }

    const updatedColumns = columns.map((column) =>
      column.id === columnId ? { ...column, tasks: [...column.tasks, newTask] } : column,
    )

    onColumnsChange(updatedColumns)
  }

  const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)),
    }))

    onColumnsChange(updatedColumns)
  }

  const deleteTask = (taskId: string) => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => task.id !== taskId),
    }))

    onColumnsChange(updatedColumns)
  }

  const reorderTask = (taskId: string, columnId: string, newIndex: number) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        const tasks = [...column.tasks]
        const taskIndex = tasks.findIndex((task) => task.id === taskId)

        if (taskIndex !== -1) {
          const [movedTask] = tasks.splice(taskIndex, 1)
          tasks.splice(newIndex, 0, movedTask)
        }

        return { ...column, tasks }
      }
      return column
    })

    onColumnsChange(updatedColumns)
  }

  const moveTask = (taskId: string, targetColumnId: string, targetIndex?: number) => {
    const sourceColumn = columns.find((col) => col.tasks.some((task) => task.id === taskId))
    const task = sourceColumn?.tasks.find((task) => task.id === taskId)

    if (!task || !sourceColumn) return

    const updatedColumns = columns.map((column) => {
      if (column.id === sourceColumn.id) {
        // Remove task from source column
        return {
          ...column,
          tasks: column.tasks.filter((t) => t.id !== taskId),
        }
      } else if (column.id === targetColumnId) {
        // Add task to target column at specific index
        const newTasks = [...column.tasks]
        const insertIndex = targetIndex !== undefined ? targetIndex : newTasks.length
        newTasks.splice(insertIndex, 0, { ...task, columnId: targetColumnId })
        return {
          ...column,
          tasks: newTasks,
        }
      }
      return column
    })

    onColumnsChange(updatedColumns)
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
  }

  const handleDrop = (columnId: string, targetIndex?: number) => {
    if (draggedTask) {
      moveTask(draggedTask.id, columnId, targetIndex)
    }
    setDraggedTask(null)
  }

  const handleTrashDrop = () => {
    if (draggedTask) {
      deleteTask(draggedTask.id)
    }
    setDraggedTask(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-full overflow-x-auto">
        <div className="lg:hidden flex gap-4 min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="w-80 flex-shrink-0">
              <KanbanColumn
                column={column}
                onAddTask={(task) => addTask(column.id, task)}
                onDeleteTask={deleteTask}
                onUpdateTask={updateTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                draggedTask={draggedTask}
              />
            </div>
          ))}
        </div>

        <div className="hidden lg:contents">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={(task) => addTask(column.id, task)}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              draggedTask={draggedTask}
            />
          ))}
        </div>
      </div>

      <TrashZone onDrop={handleTrashDrop} isDragActive={!!draggedTask} />
    </>
  )
}