"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Button } from "@/components/shadcn/button";
import { Plus, Pencil, Trash2, Layout, Info } from "lucide-react";
import { Id } from "~/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

export default function ThemesPage() {
  const variants = useQuery(api.variants.list);
  const createVariant = useMutation(api.variants.create);
  const updateVariant = useMutation(api.variants.update);
  const removeVariant = useMutation(api.variants.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [variantName, setVariantName] = useState("");
  
  const [deletingVariant, setDeletingVariant] = useState<any>(null);
  const [handleIcons, setHandleIcons] = useState<"delete" | "reassign">("reassign");
  const [newVariantId, setNewVariantId] = useState<string>("");

  const handleSave = async () => {
    if (!variantName.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      if (editingVariant) {
        await updateVariant({ id: editingVariant._id, name: variantName });
        toast.success("Variant updated");
      } else {
        await createVariant({ name: variantName });
        toast.success("Variant created");
      }
      setIsModalOpen(false);
      setEditingVariant(null);
      setVariantName("");
    } catch (error) {
      toast.error("Failed to save variant");
    }
  };

  const openDeleteModal = (variant: any) => {
    setDeletingVariant(variant);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (handleIcons === "reassign" && !newVariantId) {
      toast.error("Please select a new variant for reassignment");
      return;
    }

    try {
      await removeVariant({
        id: deletingVariant._id,
        handleIcons,
        newVariantId: handleIcons === "reassign" ? (newVariantId as Id<"tech_icon_variant">) : undefined,
      });
      toast.success("Variant deleted");
      setIsDeleteModalOpen(false);
      setDeletingVariant(null);
      setNewVariantId("");
    } catch (error) {
      toast.error("Failed to delete variant");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Icon Themes / Variants</h1>
          <p className="text-muted-foreground">Manage different versions or styles for technology icons.</p>
        </div>
        <Button onClick={() => { setEditingVariant(null); setVariantName(""); setIsModalOpen(true); }} className="gap-2">
            <Plus className="w-4 h-4" /> Add Variant
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {variants === undefined ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl border" />
          ))
        ) : variants.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-muted/50 rounded-xl border-2 border-dashed">
            <p>No variants found. Create one to get started!</p>
          </div>
        ) : (
          variants.map((v) => (
            <div key={v._id} className="group bg-card hover:bg-accent transition-all duration-300 rounded-xl border p-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Layout className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{v.name}</span>
                </div>
                <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                        setEditingVariant(v);
                        setVariantName(v.name);
                        setIsModalOpen(true);
                    }}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => openDeleteModal(v)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVariant ? "Edit Variant" : "Add Variant"}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Variant Name</Label>
                <Input 
                    id="name" 
                    value={variantName} 
                    onChange={(e) => setVariantName(e.target.value)} 
                    placeholder="e.g. Colored, Line, Duo-tone"
                />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Variant: {deletingVariant?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="flex gap-3 p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
                <Info className="w-5 h-5 shrink-0" />
                <p>This variant is currently used by some icons. What should we do with them?</p>
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Button 
                        variant={handleIcons === "reassign" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setHandleIcons("reassign")}
                    >
                        Reassign Icons
                    </Button>
                    <Button 
                        variant={handleIcons === "delete" ? "destructive" : "outline"}
                        className="flex-1"
                        onClick={() => setHandleIcons("delete")}
                    >
                        Delete All Linked
                    </Button>
                </div>

                {handleIcons === "reassign" && (
                    <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
                        <Label>Select New Variant</Label>
                        <Select value={newVariantId} onValueChange={setNewVariantId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select variant..." />
                            </SelectTrigger>
                            <SelectContent>
                                {variants?.filter(v => v._id !== deletingVariant?._id).map(v => (
                                    <SelectItem key={v._id} value={v._id}>{v.name}</SelectItem>
                                ))}
                                {variants?.filter(v => v._id !== deletingVariant?._id).length === 0 && (
                                    <p className="p-2 text-xs text-muted-foreground">No other variants available</p>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1">Confirm Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
