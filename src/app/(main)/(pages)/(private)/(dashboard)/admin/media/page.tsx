"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { format } from "date-fns"
import { useSearch } from "@/context/SearchContext"
import { 
    Trash2, 
    Upload, 
    Loader2, 
    FileText, 
    Image as ImageIcon,
    MoreHorizontal,
    Copy,
    ExternalLink,
    Folder,
    FolderPlus,
    ChevronRight,
    Home,
    Move,
    CheckSquare,
    Square,
    Search,
    Tag,
    X as CloseIcon
} from "lucide-react"
import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import {
    Card,
    CardContent,
} from "@/components/shadcn/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/shadcn/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/shadcn/dialog"
import { toast } from "sonner"

import {
  DndContext, 
  DragOverlay, 
  useDraggable, 
  useDroppable,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { cn } from "@/lib/utils"

// Types
type FileItem = {
    _id: string;
    type: 'file';
    name: string;
    url: string;
    size: number;
    createdAt: number;
    mimeType: string;
    tags?: string[];
}

type FolderItem = {
    _id: string;
    type: 'folder';
    name: string;
    createdAt: number;
    tags?: string[];
}

type MediaItem = FileItem | FolderItem;

export default function MediaPage() {
    // -- State --
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    
    // -- Queries --
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mediaData = useQuery(api.authorized.storage.listMedia, { folderId: currentFolderId as any });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const folderPath = useQuery(api.authorized.storage.getFolderPath, { folderId: currentFolderId as any });

    // -- Mutations --
    const generateUploadUrl = useMutation(api.authorized.storage.generateUploadUrl);
    const saveMedia = useMutation(api.authorized.storage.saveMedia);
    const deleteMedia = useMutation(api.authorized.storage.deleteMedia);
    const createFolder = useMutation(api.authorized.storage.createFolder);
    const deleteFolder = useMutation(api.authorized.storage.deleteFolder);
    const renameFolder = useMutation(api.authorized.storage.renameFolder);
    const moveItems = useMutation(api.authorized.storage.moveItems);

    // -- Local UI State --
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [renameItem, setRenameItem] = useState<{id: string, name: string, tags?: string[]} | null>(null);
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const { query: searchTerm, setPlaceholder } = useSearch();

    useEffect(() => {
        setPlaceholder("Search files, folders, or tags...");
    }, [setPlaceholder]);

    // -- DND Sensors --
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require movement to start drag
            },
        })
    );

    // -- Derived Data --
    const items = useMemo(() => {
        if (!mediaData) return [];
        const allItems = [
            ...mediaData.folders.map(f => ({ ...f, type: 'folder' } as FolderItem)),
            ...mediaData.files.map(f => ({ ...f, type: 'file', mimeType: f.type } as FileItem))
        ];

        if (!searchTerm.trim()) return allItems;

        return allItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [mediaData, searchTerm]);

    const activeDragItem = useMemo(() => {
        return items.find(i => i._id === activeDragId);
    }, [activeDragId, items]);

    // -- Handlers --

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        let successCount = 0;
        let failCount = 0;

        for (const file of files) {
            try {
                // 1. Get upload URL
                const postUrl = await generateUploadUrl();
                
                // 2. Upload file
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });
                
                if (!result.ok) throw new Error("Upload failed");
                const { storageId } = await result.json();

                // 3. Save metadata
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await saveMedia({
                    storageId,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    folderId: currentFolderId as any,
                });
                successCount++;
            } catch (error) {
                console.error("Upload failed for", file.name, error);
                failCount++;
            }
        }

        if (successCount > 0) toast.success(`Uploaded ${successCount} files`);
        if (failCount > 0) toast.error(`Failed to upload ${failCount} files`);

        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await createFolder({ name: newFolderName, parentId: currentFolderId as any });
            setNewFolderName("");
            setIsCreateFolderOpen(false);
            toast.success("Folder created");
        } catch {
            toast.error("Failed to create folder");
        }
    };

    const handleRename = async () => {
        if (!renameItem || !renameItem.name.trim()) return;
        try {
            if (items.find(i => i._id === renameItem.id)?.type === 'folder') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await renameFolder({ id: renameItem.id as any, name: renameItem.name });
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await updateMedia({ 
                    id: renameItem.id as any, 
                    name: renameItem.name,
                    tags: renameItem.tags 
                });
            }
            setIsRenameOpen(false);
            setRenameItem(null);
            toast.success("Updated successfully");
        } catch {
            toast.error("Failed to update");
        }
    };

    const updateMedia = useMutation(api.authorized.storage.updateMedia);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDelete = async (itemsToDelete: MediaItem[]) => {
        if (!confirm(`Are you sure you want to delete ${itemsToDelete.length} items?`)) return;

        try {
            for (const item of itemsToDelete) {
                if (item.type === 'folder') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await deleteFolder({ id: item._id as any });
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await deleteMedia({ id: item._id as any, storageId: (item as any).storageId });
                }
            }
            setSelectedIds(new Set());
            toast.success("Deleted successfully");
        } catch {
            toast.error("Failed to delete items");
        }
    };

    const handleMoveToFolder = async (targetFolderId: string | undefined, itemsToMove: MediaItem[]) => {
         const fileIds = itemsToMove.filter(i => i.type === 'file').map(i => i._id);
         const folderIds = itemsToMove.filter(i => i.type === 'folder').map(i => i._id);

         try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await moveItems({
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  fileIds: fileIds as any[],
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  folderIds: folderIds as any[],
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  targetFolderId: targetFolderId as any
              });
             toast.success("Moved successfully");
             setSelectedIds(new Set());
         } catch (error) {
             toast.error("Failed to move items");
             console.error(error);
         }
    };

    // -- Selection Logic --
    const toggleSelection = (id: string, multiSelect: boolean) => {
        const newSet = new Set(multiSelect ? selectedIds : []);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    // -- DND Logic --
    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragId(null);

        if (!over) return;

        const draggedId = active.id as string;
        const targetId = over.id as string;

        // Verify we dropped ONTO a folder (not the same item)
        if (draggedId === targetId) return;

        // If target is "ROOT_DROP_ZONE" (e.g. breadcrumb or area), move to root? 
        // For now, let's assume dropping one item onto another folder.
        
        const targetItem = items.find(i => i._id === targetId);
        
        // Only allow dropping onto a folder
        if (targetItem && targetItem.type === 'folder') {
             // Move the dragged item (and any other selected items if the dragged item is part of selection)
             const isDraggedSelected = selectedIds.has(draggedId);
             let itemsToMove: MediaItem[] = [];

             if (isDraggedSelected) {
                 // Move all selected items
                 itemsToMove = items.filter(i => selectedIds.has(i._id));
             } else {
                 // Just move the dragged item
                 const dragging = items.find(i => i._id === draggedId);
                 if (dragging) itemsToMove = [dragging];
             }

             if (itemsToMove.length > 0) {
                 handleMoveToFolder(targetItem._id, itemsToMove);
             }
        }
    };





    if (!mediaData) {
         return (
            <div className="flex bg-background h-full w-full items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
         );
    }

    return (
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
        >
            <div className="container mx-auto py-6 space-y-6 select-none h-full text-foreground">
                {/* Header / Config Bar */}
                <div className="flex flex-col space-y-4 border-b pb-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-1 text-muted-foreground hover:text-foreground"
                                    onClick={() => {
                                        setCurrentFolderId(undefined);
                                        setSelectedIds(new Set());
                                    }}
                                >
                                    <Home className="w-4 h-4 mr-1" />
                                    Home
                                </Button>
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {folderPath?.map((folder: any) => (
                                    <div key={folder._id} className="flex items-center">
                                        <ChevronRight className="w-4 h-4 mx-1" />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-1 font-medium text-foreground"
                                            onClick={() => {
                                                setCurrentFolderId(folder._id);
                                                setSelectedIds(new Set());
                                            }}
                                        >
                                            {folder.name}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                             {selectedIds.size > 0 && (
                                 <>
                                     <span className="text-sm text-muted-foreground mr-2">{selectedIds.size} selected</span>
                                     <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleDelete(items.filter(i => selectedIds.has(i._id)))}
                                     >
                                         <Trash2 className="w-4 h-4 mr-2" />
                                         Delete
                                     </Button>
                                     {/* Move to Home Logic (if strict subfolder) */}
                                     {currentFolderId && (
                                         <Button
                                             variant="secondary"
                                             size="sm"
                                             onClick={() => handleMoveToFolder(undefined, items.filter(i => selectedIds.has(i._id)))}
                                         >
                                             <Move className="w-4 h-4 mr-2" />
                                             Move to Root
                                         </Button>
                                     )}
                                 </>
                             )}
                             <Button variant="outline" size="sm" onClick={() => setIsCreateFolderOpen(true)}>
                                 <FolderPlus className="w-4 h-4 mr-2" />
                                 New Folder
                             </Button>
                             <Input 
                                ref={fileInputRef}
                                type="file" 
                                multiple
                                className="hidden" 
                                onChange={handleUpload}
                            />
                            <Button 
                                size="sm"
                                onClick={() => fileInputRef.current?.click()} 
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Upload className="w-4 h-4 mr-2" />
                                )}
                                Upload
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-lg bg-muted/10">
                        <Folder className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium">Empty Folder</h3>
                        <p className="text-muted-foreground mb-4">Upload files or create folders to organize your assets.</p>
                        <div className="flex gap-2">
                             <Button variant="outline" onClick={() => setIsCreateFolderOpen(true)}>Create Folder</Button>
                             <Button onClick={() => fileInputRef.current?.click()}>Upload File</Button>
                        </div>
                    </div>
                ) : (
                    <div 
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20"
                        onClick={(e) => {
                             if (e.target === e.currentTarget) {
                                 setSelectedIds(new Set());
                             }
                        }}
                    >
                         {items.map((item) => (
                             <GridItem
                                key={item._id}
                                item={item}
                                isSelected={selectedIds.has(item._id)}
                                onSelect={(multi) => toggleSelection(item._id, multi)}
                                onNavigate={(id) => {
                                    setCurrentFolderId(id);
                                    setSelectedIds(new Set());
                                }}
                                onRename={(id, name, tags) => {
                                    setRenameItem({ id, name, tags });
                                    setIsRenameOpen(true);
                                }}
                                onDelete={() => handleDelete([item])}
                                onMoveToRoot={() => handleMoveToFolder(undefined, [item])}
                             />
                         ))}
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Folder</DialogTitle>
                        <DialogDescription>Enter a name for the new folder.</DialogDescription>
                    </DialogHeader>
                    <Input 
                        placeholder="Folder Name" 
                        value={newFolderName} 
                        onChange={(e) => setNewFolderName(e.target.value)} 
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder() }}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateFolder}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Properties</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                             <label className="text-sm font-medium">Name</label>
                             <Input 
                                placeholder="Name" 
                                value={renameItem?.name || ""} 
                                onChange={(e) => setRenameItem(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleRename() }}
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium">Tags</label>
                             <div className="flex flex-wrap gap-2 mb-2">
                                 {renameItem?.tags?.map((tag: string) => (
                                     <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                         {tag}
                                         <button onClick={() => {
                                             setRenameItem(prev => prev ? ({
                                                 ...prev,
                                                 tags: prev.tags?.filter((t: string) => t !== tag)
                                             }) : null)
                                         }}>
                                             <CloseIcon className="w-3 h-3" />
                                         </button>
                                     </Badge>
                                 ))}
                             </div>
                             <Input 
                                placeholder="Add tag and press Enter" 
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = e.currentTarget.value.trim();
                                        if (val && !renameItem?.tags?.includes(val)) {
                                            setRenameItem(prev => prev ? ({
                                                ...prev,
                                                tags: [...(prev.tags || []), val]
                                            }) : null);
                                            e.currentTarget.value = "";
                                        }
                                    }
                                }}
                             />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
                        <Button onClick={handleRename}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DragOverlay>
                {activeDragItem ? (
                     <div className="w-[150px] opacity-80 pointer-events-none">
                         <Card className="shadow-2xl border-primary">
                             <CardContent className="p-2 flex items-center gap-2">
                                 {activeDragItem.type === 'folder' ? (
                                     <Folder className="w-8 h-8 fill-primary/20 text-primary" />
                                 ) : (
                                     <FileText className="w-8 h-8" />
                                 )}
                                 <span className="truncate text-xs font-bold">{activeDragItem.name}</span>
                             </CardContent>
                         </Card>
                         {selectedIds.size > 1 && (
                             <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow">
                                 {selectedIds.size}
                             </div>
                         )}
                     </div>
                ) : null}
            </DragOverlay>

        </DndContext>
    )
}

function GridItem({ 
    item, 
    isSelected, 
    onSelect, 
    onNavigate,
    onRename,
    onDelete,
    onMoveToRoot
}: { 
    item: MediaItem, 
    isSelected: boolean,
    onSelect: (multi: boolean) => void,
    onNavigate: (id: string) => void,
    onRename: (id: string, name: string, tags?: string[]) => void,

    onDelete: (id: string) => void,
    onMoveToRoot: () => void
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: item._id,
        data: item
    });

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: item._id,
        disabled: item.type !== 'folder',
        data: item
    });

    // Merge refs
    const setRefs = (node: HTMLElement | null) => {
        setNodeRef(node);
        setDroppableRef(node);
    };

    const handleClick = (e: React.MouseEvent) => {
        // e.stopPropagation();
        onSelect(e.metaKey || e.shiftKey || e.ctrlKey);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (item.type === 'folder') {
            onNavigate(item._id);
        } else if (item.type === 'file') {
             // Open file preview
             window.open(item.url, '_blank');
        }
    };



    return (
        <>
            <div 
                ref={setRefs}
                {...attributes}
                {...listeners}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                className={cn(
                    "relative group cursor-pointer transition-all duration-200",
                    isDragging && "opacity-30",
                )}
            >
                <Card 
                    className={cn(
                        "overflow-hidden transition-all duration-200 hover:shadow-md border",
                        isSelected && "ring-2 ring-primary border-primary bg-primary/5",
                        isOver && item.type === 'folder' && !isDragging && "ring-2 ring-green-500 bg-green-500/10 scale-105"
                    )}
                >
                    <div className="relative aspect-[4/3] flex items-center justify-center bg-muted/30">
                         {item.type === 'folder' ? (
                             <Folder className={cn(
                                 "w-16 h-16 text-muted-foreground/60 transition-colors",
                                 isSelected ? "fill-primary/20 text-primary" : "fill-yellow-500/20 text-yellow-500"
                             )} />
                         ) : (
                             item.mimeType?.startsWith('image/') ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                 <img 
                                    src={item.url} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover" 
                                    loading="lazy"
                                 />
                             ) : (
                                 <div className="flex flex-col items-center">
                                     <FileText className="w-12 h-12 text-muted-foreground/50 mb-1" />
                                     <span className="text-[10px] uppercase font-mono text-muted-foreground">{item.mimeType?.split('/')[1] || 'FILE'}</span>
                                 </div>
                             )
                         )}

                         {/* Selection Checkbox (Visible on hover or selected) */}
                         <div className={cn(
                             "absolute top-2 left-2 z-10 transition-opacity",
                             isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                         )}>
                             {isSelected ? (
                                 <CheckSquare className="w-5 h-5 text-primary fill-background" />
                             ) : (
                                 <Square className="w-5 h-5 text-muted-foreground/60" />
                             )}
                         </div>

                         {/* Actions Menu */}
                         <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                             <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                     <Button variant="secondary" size="icon" className="h-6 w-6">
                                         <MoreHorizontal className="w-3 h-3" />
                                     </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                     <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                                     <DropdownMenuSeparator />
                                     <DropdownMenuItem onClick={() => onRename(item._id, item.name, item.tags)}>Edit Properties</DropdownMenuItem>
                                     {item.type === 'file' && (
                                         <DropdownMenuItem onClick={() => {
                                             navigator.clipboard.writeText(item.url);
                                             toast.success("Copied URL");
                                         }}>
                                             <Copy className="w-3 h-3 mr-2" /> 
                                             Copy Link
                                         </DropdownMenuItem>
                                     )}
                                     {item.type === 'file' && (
                                         <DropdownMenuItem onClick={() => window.open(item.url, '_blank')}>
                                              <ExternalLink className="w-3 h-3 mr-2" />
                                              Open
                                         </DropdownMenuItem>
                                     )}
                                     <DropdownMenuItem onClick={onMoveToRoot}>
                                        <Move className="w-3 h-3 mr-2" />
                                        Move to Root
                                     </DropdownMenuItem>
                                     <DropdownMenuSeparator />
                                     <DropdownMenuItem 
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => onDelete(item._id)}
                                    >
                                         <Trash2 className="w-3 h-3 mr-2" />
                                         Delete
                                     </DropdownMenuItem>
                                 </DropdownMenuContent>
                             </DropdownMenu>
                         </div>
                    </div>

                    <div className="p-3">
                         <p className="font-medium text-sm truncate select-text" title={item.name}>{item.name}</p>
                         <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                             <span>{item.type === 'file' ? formatBytes(item.size) : 'Folder'}</span>
                             <span>{format(item.createdAt, 'MM/dd/yyyy')}</span>
                         </div>
                         {item.tags && item.tags.length > 0 && (
                             <div className="flex flex-wrap gap-1 mt-2">
                                 {item.tags.slice(0, 3).map(tag => (
                                     <Badge key={tag} variant="outline" className="text-[9px] px-1 h-4">{tag}</Badge>
                                 ))}
                                 {item.tags.length > 3 && <span className="text-[9px] text-muted-foreground">+{item.tags.length - 3}</span>}
                             </div>
                         )}
                    </div>
                </Card>
            </div>
        </>
    )
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
