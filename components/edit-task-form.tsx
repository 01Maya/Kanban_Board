"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/app/page"

interface EditTaskFormProps {
  task: Task
  onSave: (updates: Partial<Task>) => void
  onCancel: () => void
}

const colorOptions = [
  { value: "blue", label: "Blue", dotClass: "bg-blue-500" },
  { value: "green", label: "Green", dotClass: "bg-green-500" },
  { value: "orange", label: "Orange", dotClass: "bg-orange-500" },
  { value: "purple", label: "Purple", dotClass: "bg-purple-500" },
  { value: "red", label: "Red", dotClass: "bg-red-500" },
  { value: "yellow", label: "Yellow", dotClass: "bg-yellow-500" },
]

export function EditTaskForm({ task, onSave, onCancel }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [colorTag, setColorTag] = useState(task.colorTag)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      colorTag,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel()
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e as any)
    }
  }

  return (
    <Card className="bg-background border-border border-2 border-accent/50">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3" onKeyDown={handleKeyDown}>
          <Input
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm font-semibold"
            autoFocus
            maxLength={100}
          />

          <Textarea
            placeholder="Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-sm min-h-[60px] resize-none"
            maxLength={500}
          />

          <Select value={colorTag} onValueChange={setColorTag}>
            <SelectTrigger className="text-sm">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${colorOptions.find((opt) => opt.value === colorTag)?.dotClass}`}
                  />
                  <span className="text-xs text-muted-foreground">Color</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${option.dotClass}`} />
                    <span className="sr-only">{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button type="submit" size="sm" className="flex-1" disabled={!title.trim()}>
              <span className="mr-1">✓</span>
              Save Changes
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              <span>✕</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">Press Ctrl+Enter to save, Esc to cancel</p>
        </form>
      </CardContent>
    </Card>
  )
}
