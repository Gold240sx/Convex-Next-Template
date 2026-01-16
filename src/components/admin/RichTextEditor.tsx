"use client"

import React, { useEffect } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { 
    Bold, 
    Italic, 
    Underline as UnderlineIcon, 
    Strikethrough, 
    Code, 
    List, 
    ListOrdered, 
    Quote, 
    Undo, 
    Redo,
    Link as LinkIcon,
    AlignCenter,
    AlignLeft,
    AlignRight,
    Highlighter,
    CheckSquare,
    Heading1,
    Heading2,
    Heading3
} from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const buttons = [
        { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold' },
        { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic' },
        { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline' },
        { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: 'strike' },
        { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: 'code' },
        { divider: true },
        { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: { heading: { level: 1 } } },
        { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: { heading: { level: 2 } } },
        { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: { heading: { level: 3 } } },
        { divider: true },
        { icon: AlignLeft, action: () => editor.chain().focus().setTextAlign('left').run(), active: { textAlign: 'left' } },
        { icon: AlignCenter, action: () => editor.chain().focus().setTextAlign('center').run(), active: { textAlign: 'center' } },
        { icon: AlignRight, action: () => editor.chain().focus().setTextAlign('right').run(), active: { textAlign: 'right' } },
        { divider: true },
        { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList' },
        { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList' },
        { icon: CheckSquare, action: () => editor.chain().focus().toggleTaskList().run(), active: 'taskList' },
        { divider: true },
        { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote' },
        { icon: LinkIcon, action: setLink, active: 'link' },
        { icon: Highlighter, action: () => editor.chain().focus().toggleHighlight().run(), active: 'highlight' },
        { divider: true },
        { icon: Undo, action: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo() },
        { icon: Redo, action: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo() },
    ]

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/30 backdrop-blur-sm sticky top-0 z-10 transition-all duration-300">
            {buttons.map((btn, i) => (
                btn.divider ? (
                    <div key={i} className="w-px h-6 bg-border mx-1 self-center" />
                ) : (
                    <Button
                        key={i}
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={btn.action}
                        disabled={btn.disabled}
                        className={cn(
                            "h-8 w-8 rounded-lg transition-all duration-200",
                            btn.active && editor.isActive(btn.active) 
                                ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold" 
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        {btn.icon && <btn.icon className="h-4 w-4" />}
                    </Button>
                )
            ))}
        </div>
    )
}

export function RichTextEditor({ content, onChange, placeholder = "Start typing..." }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-teal-500 underline decoration-teal-500/30 underline-offset-4 hover:decoration-teal-500 transition-all cursor-pointer'
                }
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[300px] p-6 lg:p-8 prose prose-slate dark:prose-invert max-w-none'
            }
        }
    })

    // Update editor content if it changes externally
    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content)
      }
    }, [content, editor])

    return (
        <div className="border border-border rounded-3xl overflow-hidden bg-card shadow-2xl transition-all duration-500 group focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            <style jsx global>{`
                .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                    font-style: italic;
                }
                .tiptap ul[data-type="taskList"] {
                    list-style: none;
                    padding: 0;
                }
                .tiptap ul[data-type="taskList"] li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .tiptap ul[data-type="taskList"] input[type="checkbox"] {
                    margin-top: 0.4rem;
                    cursor: pointer;
                    accent-color: #14b8a6;
                }
            `}</style>
        </div>
    )
}
