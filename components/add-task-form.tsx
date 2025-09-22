"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/app/page"

interface AddTaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "columnId">) => void
  onCancel: () => void
}

const colorOptions = [
  { value: "blue", dotClass: "bg-blue-500" },
  { value: "green", dotClass: "bg-green-500" },
  { value: "orange", dotClass: "bg-orange-500" },
  { value: "purple", dotClass: "bg-purple-500" },
  { value: "red", dotClass: "bg-red-500" },
  { value: "yellow", dotClass: "bg-yellow-500" },
]

export function AddTaskForm({ onSubmit, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [colorTag, setColorTag] = useState("blue")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      colorTag,
    })

    setTitle("")
    setDescription("")
    setColorTag("blue")
  }

  return (
    <Card className="bg-background border-border">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm"
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
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="hover:bg-white focus:bg-white">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${option.dotClass}`} />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button type="submit" size="sm" className="flex-1" disabled={!title.trim()}>
              ✓ Add Task
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              ✕
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
