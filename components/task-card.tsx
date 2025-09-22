"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/app/page"

interface TaskCardProps {
  task: Task
  onDelete: (taskId: string) => void
  onUpdate: (taskId: string, updatedTask: Partial<Task>) => void
  onDragStart: (task: Task) => void
  onDragEnd: () => void
  isDragging: boolean
}

const colorDotStyles = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
}

const colorOptions = [
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "orange", label: "Orange" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "yellow", label: "Yellow" },
]

export function TaskCard({ task, onDelete, onUpdate, onDragStart, onDragEnd, isDragging }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || "",
    colorTag: task.colorTag,
  })

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(task.id)
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    onDragStart(task)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation()
    onDragEnd()
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditData({
      title: task.title,
      description: task.description || "",
      colorTag: task.colorTag,
    })
  }

  const handleSave = () => {
    if (editData.title.trim()) {
      onUpdate(task.id, {
        title: editData.title.trim(),
        description: editData.description.trim(),
        colorTag: editData.colorTag,
      })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      title: task.title,
      description: task.description || "",
      colorTag: task.colorTag,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <Card className="bg-background border-border">
        <CardContent className="p-4 space-y-3">
          <Input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Task title"
            className="font-semibold"
            onKeyDown={handleKeyDown}
            autoFocus
          />

          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Description (optional)"
            className="min-h-[60px] resize-none"
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-center justify-between">
            <Select value={editData.colorTag} onValueChange={(value) => setEditData({ ...editData, colorTag: value })}>
              <SelectTrigger className="w-32">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        colorDotStyles[editData.colorTag as keyof typeof colorDotStyles] || colorDotStyles.blue
                      }`}
                    />
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value} className="hover:bg-white">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${colorDotStyles[color.value as keyof typeof colorDotStyles]}`}
                      />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={!editData.title.trim()}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`group cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-background border-border select-none ${
        isDragging ? "opacity-50 rotate-2 scale-105" : ""
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={handleDoubleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2 flex-1">
            <div className="h-4 w-1 bg-muted-foreground/30 rounded-full mt-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
            <h3 className="font-semibold text-foreground text-sm leading-tight text-pretty flex-1">{task.title}</h3>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-orange-500"
            onClick={handleDelete}
          >
            ✕
          </Button>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed ml-6">{task.description}</p>
        )}

        <div className="flex items-center justify-between ml-6">
          <div
            className={`w-3 h-3 rounded-full ${
              colorDotStyles[task.colorTag as keyof typeof colorDotStyles] || colorDotStyles.blue
            }`}
            title={task.colorTag}
          />
          <span className="text-xs text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
            Double-click to edit
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
