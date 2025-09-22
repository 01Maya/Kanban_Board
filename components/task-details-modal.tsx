"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task, Column } from "@/app/page"
import { EditTaskForm } from "./edit-task-form"

interface TaskDetailsModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onDelete: (taskId: string) => void
  columns: Column[]
  onMoveTask: (taskId: string, targetColumnId: string) => void
}

const colorDotStyles = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
}

export function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  columns,
  onMoveTask,
}: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (!task) return null

  const currentColumn = columns.find((col) => col.id === task.columnId)
  const otherColumns = columns.filter((col) => col.id !== task.columnId)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = (updates: Partial<Task>) => {
    onUpdate(task.id, updates)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id)
      onClose()
    }
  }

  const handleMoveTask = (targetColumnId: string) => {
    onMoveTask(task.id, targetColumnId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold text-pretty">Task Details</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <span>✕</span>
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isEditing ? (
            <EditTaskForm task={task} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
          ) : (
            <>
              {/* Task Header */}
              <div className="space-y-4">
                <h3 className="font-bold text-foreground text-xl leading-tight text-pretty">{task.title}</h3>

                {task.description && (
                  <p className="text-muted-foreground leading-relaxed text-balance">{task.description}</p>
                )}

                {/* Task Metadata */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">🏷️</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          colorDotStyles[task.colorTag as keyof typeof colorDotStyles] || colorDotStyles.blue
                        }`}
                        title={task.colorTag}
                      />
                      <span className="text-sm text-muted-foreground capitalize">{task.colorTag}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">📅</span>
                    <span className="text-sm text-muted-foreground">
                      Created: {new Date(Number.parseInt(task.id)).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Current Column */}
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Current Status:</span>
                  <Badge variant="outline" className="font-medium">
                    {currentColumn?.title}
                  </Badge>
                </div>
              </div>

              {/* Move Task Section */}
              {otherColumns.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <span>➡️</span>
                    Move Task
                  </h4>
                  <Select onValueChange={handleMoveTask}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a column to move to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {otherColumns.map((column) => (
                        <SelectItem key={column.id} value={column.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{column.title}</span>
                            <Badge variant="secondary" className="ml-2">
                              {column.tasks.length} tasks
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={handleEdit} className="flex-1 bg-transparent">
                  <span className="mr-2">✏️</span>
                  Edit Task
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive bg-transparent"
                >
                  <span className="mr-2">🗑️</span>
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
