"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { 
    ListTodo, 
    Clock, 
    CheckCircle2, 
    Circle,
    ArrowUpRight,
    MoreVertical,
    MessageSquare,
    GripVertical,
    Archive,
    RotateCcw,
    Inbox
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"

// DND Kit Imports
import {
  DndContext, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog"
import { Label } from "@/components/shadcn/label"
import { Input } from "@/components/shadcn/input"
import { Textarea } from "@/components/shadcn/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select"
import { Calendar } from "@/components/shadcn/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover"
import { Button } from "@/components/shadcn/button"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Bell } from "lucide-react"

type TaskStatus = "todo" | "in_progress" | "done";

import { useSearch } from "@/context/SearchContext"

export default function TasksPage() {
    const [view, setView] = useState<"active" | "archived">("active")
    const { query: searchQuery } = useSearch()
    
    const convexTasks = useQuery(api.myFunctions.getTasks)
    const archivedTasks = useQuery(api.myFunctions.getArchivedTasks)
    const updateStatus = useMutation(api.myFunctions.updateTaskStatus)
    const updateTask = useMutation(api.myFunctions.updateTask)
    const archiveTaskMutation = useMutation(api.myFunctions.archiveTask)
    const unarchiveTaskMutation = useMutation(api.myFunctions.unarchiveTask)
    
    // Internal state to handle optimistic updates and drag-over animations
    const [tasks, setTasks] = useState<any[]>([]);
    const [activeTask, setActiveTask] = useState<any>(null);

    // Edit Task State
    const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<any>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">("medium")
    const [editDueDate, setEditDueDate] = useState<Date | undefined>(undefined)
    const [editReminder, setEditReminder] = useState<Date | undefined>(undefined)

    const handleEditTask = (task: any) => {
        setEditingTask(task)
        setEditTitle(task.title)
        setEditDescription(task.description)
        setEditPriority(task.priority)
        setEditDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
        setEditReminder(task.reminder ? new Date(task.reminder) : undefined)
        setIsEditTaskDialogOpen(true)
    }

    const handleSaveTask = async () => {
        if (!editingTask) return

        try {
            await updateTask({
                id: editingTask._id,
                title: editTitle,
                description: editDescription,
                priority: editPriority,
                dueDate: editDueDate ? editDueDate.getTime() : undefined,
                reminder: editReminder ? editReminder.getTime() : undefined,
            })
            toast.success("Task updated")
            setIsEditTaskDialogOpen(false)
            setEditingTask(null)
        } catch (error) {
            toast.error("Failed to update task")
        }
    }

    useEffect(() => {
        if (convexTasks) {
            setTasks(convexTasks);
        }
    }, [convexTasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (!convexTasks || !archivedTasks) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                <div className="text-muted-foreground font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Syncing Tasks...</div>
            </div>
        )
    }

    const filterTasks = (taskList: any[]) => {
        if (!searchQuery) return taskList
        const q = searchQuery.toLowerCase()
        return taskList.filter(t => 
            t.title.toLowerCase().includes(q) || 
            t.description.toLowerCase().includes(q)
        )
    }

    const filteredActiveTasks = filterTasks(tasks)
    const filteredArchivedTasks = filterTasks(archivedTasks)

    const displayedTasks = view === "active" ? filteredActiveTasks : filteredArchivedTasks

    const stats = {
        todo: filteredActiveTasks.filter(t => t.status === 'todo').length,
        inProgress: filteredActiveTasks.filter(t => t.status === 'in_progress').length,
        done: filteredActiveTasks.filter(t => t.status === 'done').length,
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveTask(tasks.find(t => t._id === active.id));
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';
        const isOverAColumn = over.data.current?.type === 'Column';

        if (!isActiveATask) return;

        // Dropping over another task
        if (isActiveATask && isOverATask) {
            setTasks(prev => {
                const activeIndex = prev.findIndex(t => t._id === activeId);
                const overIndex = prev.findIndex(t => t._id === overId);

                if (prev[activeIndex].status !== prev[overIndex].status) {
                    const updatedTasks = [...prev];
                    updatedTasks[activeIndex].status = prev[overIndex].status;
                    return arrayMove(updatedTasks, activeIndex, overIndex);
                }

                return arrayMove(prev, activeIndex, overIndex);
            });
        }

        // Dropping over a column
        if (isActiveATask && isOverAColumn) {
            setTasks(prev => {
                const activeIndex = prev.findIndex(t => t._id === activeId);
                const updatedTasks = [...prev];
                updatedTasks[activeIndex].status = overId as TaskStatus;
                return arrayMove(updatedTasks, activeIndex, activeIndex);
            });
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) {
            setActiveTask(null);
            return;
        }

        const task = tasks.find(t => t._id === active.id);
        if (!task) {
            setActiveTask(null);
            return;
        }

        // If the status changed, update Convex
        const currentTask = convexTasks.find(t => t._id === active.id);
        if (currentTask && task.status !== currentTask.status) {
            try {
                await updateStatus({ id: task._id, status: task.status });
                toast.success(`Task moved to ${task.status.replace('_', ' ')}`);
            } catch (err) {
                toast.error("Failed to sync move");
                setTasks(convexTasks); // Revert on failure
            }
        }

        setActiveTask(null);
    };

    const handleArchive = async (id: any) => {
        try {
            await archiveTaskMutation({ id })
            toast.success("Task archived")
        } catch (err) {
            toast.error("Failed to archive task")
        }
    }

    const handleUnarchive = async (id: any) => {
        try {
            await unarchiveTaskMutation({ id })
            toast.success("Task restored")
        } catch (err) {
            toast.error("Failed to restore task")
        }
    }

    const columns: { id: TaskStatus; title: string; icon: any; color: string }[] = [
        { id: 'todo', title: 'To Do', icon: Circle, color: 'text-muted-foreground' },
        { id: 'in_progress', title: 'In Progress', icon: Clock, color: 'text-teal-500' },
        { id: 'done', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20">
                            <ListTodo className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h1 className="text-5xl font-black text-foreground tracking-tighter italic uppercase">
                            {view === "active" ? "Admin Kanban" : "Archived Tasks"}
                        </h1>
                    </div>
                    <p className="text-muted-foreground font-medium max-w-lg leading-relaxed">
                        {view === "active" 
                            ? "Drag and drop cards to update your workflow. Statuses automatically sync with the database."
                            : "Vew and manage tasks that have been moved out of the active board."}
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-card border border-border p-1.5 rounded-2xl shadow-sm">
                    <button 
                        onClick={() => setView("active")}
                        className={cn(
                            "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            view === "active" ? "bg-teal-600 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Inbox className="w-3.5 h-3.5" /> Board
                    </button>
                    <button 
                        onClick={() => setView("archived")}
                        className={cn(
                            "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            view === "archived" ? "bg-teal-600 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Archive className="w-3.5 h-3.5" /> Archived
                    </button>
                </div>
            </div>

            {view === "active" ? (
                <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToWindowEdges]}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {columns.map(col => (
                            <DroppableColumn 
                                key={col.id} 
                                column={col} 
                                tasks={filteredActiveTasks.filter(t => t.status === col.id)} 
                                onArchive={handleArchive}
                                onEdit={handleEditTask}
                            />
                        ))}
                    </div>

                    <DragOverlay dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                                active: {
                                    opacity: '0.5',
                                },
                            },
                        }),
                    }}>
                        {activeTask ? (
                            <div className="w-[350px] rotate-2 scale-105 pointer-events-none">
                                <TaskCard task={activeTask} overlay />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            ) : (
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Task Title</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Archived On</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {displayedTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-muted-foreground font-medium uppercase text-xs tracking-widest">
                                        {searchQuery ? "No matching tasks found" : "No archived tasks found"}
                                    </td>
                                </tr>
                            ) : (
                                displayedTasks.map(task => (
                                    <tr key={task._id} className="group hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{task.status.replace('_', ' ')}</span>
                                        </td>
                                        <td className="px-6 py-6 font-bold text-foreground">{task.title}</td>
                                        <td className="px-6 py-6">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-500'
                                            )} />
                                        </td>
                                        <td className="px-6 py-6 text-xs text-muted-foreground">
                                            {task.archivedAt ? new Date(task.archivedAt).toLocaleDateString() : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button 
                                                onClick={() => handleUnarchive(task._id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-500/20 transition-all"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" /> Restore
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Edit Task Dialog */}
            <Dialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>
                            Update task details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">Task Title</Label>
                            <Input
                                id="edit-title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                        </div>
                        
                         <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "justify-start text-left font-normal",
                                                !editDueDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {editDueDate ? format(editDueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={editDueDate}
                                            onSelect={setEditDueDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="grid gap-2">
                                <Label>Reminder</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "justify-start text-left font-normal",
                                                !editReminder && "text-muted-foreground"
                                            )}
                                        >
                                            <Bell className="mr-2 h-4 w-4" />
                                            {editReminder ? format(editReminder, "PPP") : <span>Set reminder</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={editReminder}
                                            onSelect={setEditReminder}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-priority">Priority</Label>
                            <Select 
                                value={editPriority} 
                                onValueChange={(val: any) => setEditPriority(val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-desc">Description</Label>
                            <Textarea
                                id="edit-desc"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={5}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveTask}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function DroppableColumn({ column, tasks, onArchive, onEdit }: { column: any, tasks: any[], onArchive: (id: any) => void, onEdit: (task: any) => void }) {
    const { setNodeRef } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    });

    return (
        <div ref={setNodeRef} className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <column.icon className={cn("w-4 h-4", column.color)} />
                    <h2 className={cn("text-xs font-black uppercase tracking-[0.2em]", column.id === 'done' ? 'text-muted-foreground' : column.color)}>
                        {column.title}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold text-muted-foreground border border-border">
                        {tasks.length}
                    </span>
                </div>
            </div>

            <SortableContext 
                items={tasks.map(t => t._id)}
                strategy={verticalListSortingStrategy}
            >
                <div 
                    className={cn(
                        "flex-1 min-h-[500px] p-2 rounded-[2.5rem] transition-all duration-300",
                        "bg-muted/10 border-2 border-dashed border-border/20 hover:bg-muted/30 hover:border-teal-500/20"
                    )}
                >
                    <div className="space-y-4">
                        {tasks.length === 0 ? (
                             <div className="px-6 py-20 text-center opacity-20 select-none pointer-events-none">
                                <ListTodo className="w-10 h-10 mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Drop here</p>
                            </div>
                        ) : (
                            tasks.map(task => (
                                <TaskCard key={task._id} task={task} onArchive={onArchive} onEdit={onEdit} />
                            ))
                        )}
                    </div>
                </div>
            </SortableContext>
        </div>
    );
}

function TaskCard({ task, overlay, onArchive, onEdit }: { task: any, overlay?: boolean, onArchive?: (id: any) => void, onEdit?: (task: any) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task._id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    if (isDragging && !overlay) {
        return (
            <div 
                ref={setNodeRef}
                style={style}
                className="opacity-0 h-[150px] bg-muted/20 border-2 border-dashed border-border rounded-[2rem]"
            />
        );
    }

    return (
        <div 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group bg-card border border-border hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/[0.04] transition-all duration-300 rounded-[2rem] p-6 space-y-5 relative overflow-hidden",
                overlay ? "shadow-2xl border-teal-500/50 cursor-grabbing bg-background" : "cursor-grab active:cursor-grabbing"
            )}
        >
            {/* Priority line */}
            <div className={cn(
                "absolute top-0 left-0 w-full h-1",
                task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-500'
            )} />

            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                         <GripVertical className="w-3 h-3 text-muted-foreground/30 group-hover:text-teal-500/50 transition-colors" />
                         <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">TASK ID: {task._id.slice(-4)}</span>
                    </div>
                    <h3 className="font-black text-foreground uppercase italic tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {task.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                        {task.description}
                    </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(task);
                        }}
                        className="p-1.5 hover:bg-muted rounded-xl transition-colors text-muted-foreground/40 hover:text-foreground"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    {onArchive && (
                        <button 
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onArchive(task._id);
                            }}
                            className="p-1.5 hover:bg-muted rounded-xl transition-colors text-muted-foreground/40 hover:text-rose-500"
                            title="Archive Task"
                        >
                            <Archive className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
                <div className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm",
                    task.priority === 'high' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 
                    task.priority === 'medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                    'bg-zinc-500/10 text-zinc-600 border-zinc-500/20'
                )}>
                    {task.priority}
                </div>
                {task.sourceType === 'message' && (
                    <Link 
                        href={`/admin/user-messages/${task.sourceId}`}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border bg-teal-500/10 text-teal-600 border-teal-500/20 flex items-center gap-1 shadow-sm hover:bg-teal-500/20 transition-colors"
                    >
                        <MessageSquare className="w-3 h-3" /> Inquiry
                    </Link>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                {task.status === 'done' && (
                     <div className="flex items-center gap-1.5 text-emerald-500">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
                    </div>
                )}
            </div>
        </div>
    )
}
