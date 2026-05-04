'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, SectionMarker, Badge, Input, Label, Button } from '@/components/ds'
import type { BadgeVariant } from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'

type CompanyTask = {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done' | 'blocked'
  priority: 'high' | 'normal' | 'low'
  category: 'fundraise' | 'product' | 'sales' | 'ops' | 'marketing' | 'general'
  due_date: string | null
  assignee: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

const CATEGORIES = ['all', 'fundraise', 'product', 'sales', 'ops', 'marketing', 'general'] as const

function taskStatusToBadge(status: string): BadgeVariant {
  if (status === 'done') return 'success'
  if (status === 'in_progress') return 'warning'
  if (status === 'blocked') return 'danger'
  return 'neutral'
}

function taskPriorityColor(priority: string): string {
  if (priority === 'high') return 'var(--accent)'
  if (priority === 'low') return 'rgba(20,20,19,0.2)'
  return 'rgba(20,20,19,0.45)'
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<CompanyTask[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    category: 'general',
    priority: 'normal',
    due_date: '',
  })
  const [taskSubmitting, setTaskSubmitting] = useState(false)

  const fetchTasks = useCallback(() => {
    setLoading(true)
    fetch('/api/os/company-tasks')
      .then(r => r.json())
      .then(setTasks)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const cycleTaskStatus = useCallback(async (task: CompanyTask) => {
    const order: CompanyTask['status'][] = ['todo', 'in_progress', 'done', 'todo']
    const next = order[order.indexOf(task.status) + 1] ?? 'todo'
    const res = await fetch(`/api/os/company-tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    if (res.ok) setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: next } : t))
  }, [])

  const submitTask = async () => {
    if (!newTaskForm.title.trim()) return
    setTaskSubmitting(true)
    const res = await fetch('/api/os/company-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTaskForm),
    })
    if (res.ok) {
      const t = await res.json()
      setTasks(prev => [t, ...prev])
      setNewTaskOpen(false)
      setNewTaskForm({ title: '', category: 'general', priority: 'normal', due_date: '' })
    }
    setTaskSubmitting(false)
  }

  const deleteTask = async (id: string) => {
    await fetch(`/api/os/company-tasks/${id}`, { method: 'DELETE' })
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const filteredTasks = tasks.filter(
    t => t.status !== 'done' && (categoryFilter === 'all' || t.category === categoryFilter)
  )
  const openTaskCount = tasks.filter(t => t.status !== 'done').length

  return (
    <div className="min-h-screen bg-paper">
      <OSTopbar title="TASKS" />
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <SectionMarker num="00" label="COMPANY TASKS" />
          <div className="flex items-center gap-3">
            <span className="mono text-[11px] text-ink/40">{openTaskCount} open</span>
            <Button variant="ghost" size="sm" onClick={() => setNewTaskOpen(v => !v)}>
              + new task
            </Button>
          </div>
        </div>

        {/* Add task form */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            newTaskOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <Card className="mb-4">
            <CardContent>
              <div className="mb-3">
                <Label>Title</Label>
                <Input
                  value={newTaskForm.title}
                  onChange={e => setNewTaskForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="What needs to get done?"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <Label>Category</Label>
                  <select
                    value={newTaskForm.category}
                    onChange={e => setNewTaskForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-rule rounded-lg px-3 py-2 text-sm bg-paper text-ink cursor-pointer"
                  >
                    {['general', 'fundraise', 'product', 'sales', 'ops', 'marketing'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <select
                    value={newTaskForm.priority}
                    onChange={e => setNewTaskForm(f => ({ ...f, priority: e.target.value }))}
                    className="w-full border border-rule rounded-lg px-3 py-2 text-sm bg-paper text-ink cursor-pointer"
                  >
                    {['normal', 'high', 'low'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Due date</Label>
                  <Input
                    type="date"
                    value={newTaskForm.due_date}
                    onChange={e => setNewTaskForm(f => ({ ...f, due_date: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-3">
                <Button variant="ghost" size="sm" onClick={() => setNewTaskOpen(false)}>
                  cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={submitTask}
                  disabled={taskSubmitting}
                >
                  {taskSubmitting ? 'saving…' : 'create'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-1 mb-4 flex-wrap">
          {CATEGORIES.map(cat => {
            const count =
              cat === 'all'
                ? tasks.filter(t => t.status !== 'done').length
                : tasks.filter(t => t.status !== 'done' && t.category === cat).length
            const isActive = categoryFilter === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`mono text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded transition-all ${
                  isActive
                    ? 'bg-ink/9 border border-rule text-ink'
                    : 'bg-ink/4 border border-transparent text-ink/40 hover:text-ink/70'
                }`}
              >
                {cat}
                {count > 0 && (
                  <span className="ml-1 opacity-60">{count}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-11 bg-ink/5 rounded animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredTasks.length === 0 && (
          <Card>
            <CardContent>
              <p className="mono text-[11px] uppercase tracking-[0.1em] text-ink/25 text-center py-6">
                {openTaskCount === 0
                  ? "No open tasks — you're either done or not tracking."
                  : 'No tasks in this category.'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Task list */}
        {!loading && filteredTasks.length > 0 && (
          <Card className="overflow-hidden">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-2.5 px-4 py-2.5 border-b border-rule/50 last:border-0 hover:bg-ink/[0.02] transition-colors"
              >
                {/* Priority dot — acceptable inline style: dynamic color */}
                <span
                  style={{ background: taskPriorityColor(task.priority) }}
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  title={`priority: ${task.priority}`}
                />
                <span className="flex-1 text-sm text-ink">{task.title}</span>
                <span className="mono text-[10px] text-ink/40 uppercase tracking-[0.08em]">
                  {task.category}
                </span>
                {task.due_date && (
                  <span className="mono text-[10px] text-ink/30">{task.due_date}</span>
                )}
                <button
                  type="button"
                  onClick={() => cycleTaskStatus(task)}
                  className="cursor-pointer"
                >
                  <Badge variant={taskStatusToBadge(task.status)}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation()
                    deleteTask(task.id)
                  }}
                  className="mono text-sm text-ink/20 hover:text-ink/50 transition-colors flex-shrink-0 px-1"
                  title="delete"
                >
                  ×
                </button>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
