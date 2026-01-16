"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Button } from "@/components/shadcn/button";
import { Plus, Settings2, Trash2, ExternalLink, ImagePlus, Zap, CircleX, Search, Filter, CheckCircle2, ChevronLeft, ArrowUpDown, Copy, X, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/shadcn/textarea";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Id } from "~/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { TechnologyForm } from "@/components/admin/TechnologyForm";
import { LEGACY_VARIANT_MAP } from "@/lib/constants/legacy-mapping";
import { useSearch } from "@/context/SearchContext";
import { useEffect } from "react";
import { categoryEnum } from "@/lib/validations/technology";

export default function TechnologiesPage() {
  const techs = useQuery(api.technologies.list);
  const deleteTech = useMutation(api.technologies.remove);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<any>(null);

  const [selectedVariantId, setSelectedVariantId] = useState<string | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "name">("recent");
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);
  const { query, setPlaceholder } = useSearch();

  useEffect(() => {
    setPlaceholder("Search technologies...");
    return () => setPlaceholder("Search...");
  }, [setPlaceholder]);

  const variants = useQuery(api.technologies.listIconVariants);

  const handleDelete = async (id: Id<"tech">) => {
    if (confirm("Are you sure you want to delete this technology?")) {
      try {
        await deleteTech({ id });
        toast.success("Technology deleted");
      } catch (error) {
        toast.error("Failed to delete technology");
      }
    }
  };

  const handleEdit = (tech: any) => {
    setEditingTech(tech);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTech(null);
    setIsModalOpen(true);
  };

  const handleCopyIncompleteJSON = () => {
    const incompleteTechs = techs?.filter(tech => {
      const hasColorNoBg = tech.allIcons?.some(icon => 
        variants?.find(v => v._id === icon.variant_id)?.name.toLowerCase() === "color-no-bg"
      ) || false;
      const hasGrayNoBg = tech.allIcons?.some(icon => 
        variants?.find(v => v._id === icon.variant_id)?.name.toLowerCase() === "gray-no-bg"
      ) || false;
      const hasDarkGray = tech.allIcons?.some(icon => 
        variants?.find(v => v._id === icon.variant_id)?.name.toLowerCase() === "darkgray"
      ) || false;
      return !(hasColorNoBg && hasGrayNoBg && hasDarkGray);
    }).map(tech => ({
      oldId: tech.oldId,
      company_name: tech.company_name,
      missing_variants: [
        ...(!tech.allIcons?.some(icon => variants?.find(v => v._id === icon.variant_id)?.name.toLowerCase() === "color-no-bg") ? ["color-no-bg"] : []),
        ...(!tech.allIcons?.some(icon => variants?.find(v => v._id === icon.variant_id)?.name.toLowerCase() === "gray-no-bg") ? ["gray-no-bg"] : []),
        ...(!tech.allIcons?.some(icon => variants?.find(v => v._id === icon.variant_id)?.name.toLowerCase() === "darkgray") ? ["darkGray"] : []),
      ]
    }));
    
    navigator.clipboard.writeText(JSON.stringify(incompleteTechs, null, 2));
    toast.success(`Copied ${incompleteTechs?.length || 0} incomplete technologies to clipboard`);
  };

  const handleFindDuplicates = () => {
    const duplicates: any[] = [];
    
    techs?.forEach(tech => {
      if (tech.allIcons && tech.allIcons.length > 0) {
        // Group icons by variant_id
        const variantGroups = new Map<string, any[]>();
        
        tech.allIcons.forEach(icon => {
          const key = icon.variant_id || "no-variant";
          if (!variantGroups.has(key)) {
            variantGroups.set(key, []);
          }
          variantGroups.get(key)!.push(icon);
        });
        
        // Check for duplicates
        variantGroups.forEach((icons, variantId) => {
          if (icons.length > 1) {
            const variantName = variants?.find(v => v._id === variantId)?.name || "unknown";
            duplicates.push({
              tech_name: tech.company_name,
              tech_id: tech._id,
              variant: variantName,
              variant_id: variantId,
              count: icons.length,
              icon_ids: icons.map(i => i._id)
            });
          }
        });
      }
    });
    
    if (duplicates.length > 0) {
      console.log("Found duplicates:", duplicates);
      navigator.clipboard.writeText(JSON.stringify(duplicates, null, 2));
      toast.error(`Found ${duplicates.length} duplicate icon entries! Check console and clipboard.`);
    } else {
      toast.success("No duplicates found!");
    }
  };

  // Filtered and sorted technologies
  const filteredTechs = techs
    ?.filter(tech => {
      // Check if ANY of the icons match the selected variant
      const matchesVariant = selectedVariantId === "all" || 
        tech.allIcons?.some(icon => icon.variant_id === selectedVariantId);
      const matchesSearch = tech.company_name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === "all" || tech.details?.category === selectedCategory;
      return matchesVariant && matchesSearch && matchesCategory;
    })
    .map(tech => {
      // Find the icon for the selected variant to display
      let displayIcon = null;
      
      if (selectedVariantId === "all" && tech.allIcons && tech.allIcons.length > 0) {
        // Default to color-no-bg variant when showing all
        const colorNoBgVariant = variants?.find(v => v.name.toLowerCase() === "color-no-bg");
        if (colorNoBgVariant) {
          const colorIcon = tech.allIcons.find(icon => 
            icon.variant_id === colorNoBgVariant._id && icon.file_url && icon.file_url.trim() !== ""
          );
          if (colorIcon) displayIcon = colorIcon;
        }
        // Fallback to first icon with valid file_url if color-no-bg doesn't exist or is empty
        if (!displayIcon) {
          displayIcon = tech.allIcons.find(icon => icon.file_url && icon.file_url.trim() !== "") || tech.allIcons[0];
        }
      } else if (selectedVariantId !== "all" && tech.allIcons) {
        displayIcon = tech.allIcons.find(icon => icon.variant_id === selectedVariantId) || null;
      } else if (tech.allIcons && tech.allIcons.length > 0) {
        displayIcon = tech.allIcons.find(icon => icon.file_url && icon.file_url.trim() !== "") || tech.allIcons[0];
      }
      
      // Check completion status - must have SVG content, not just the icon entry
      const hasColorNoBg = tech.allIcons?.some(icon => {
        const variant = variants?.find(v => v._id === icon.variant_id);
        return variant?.name.toLowerCase() === "color-no-bg" && icon.file_url && icon.file_url.trim() !== "";
      }) || false;
      
      const hasGrayNoBg = tech.allIcons?.some(icon => {
        const variant = variants?.find(v => v._id === icon.variant_id);
        return variant?.name.toLowerCase() === "gray-no-bg" && icon.file_url && icon.file_url.trim() !== "";
      }) || false;
      
      const hasDarkGray = tech.allIcons?.some(icon => {
        const variant = variants?.find(v => v._id === icon.variant_id);
        return variant?.name.toLowerCase() === "darkgray" && icon.file_url && icon.file_url.trim() !== "";
      }) || false;
      
      const isComplete = hasColorNoBg && hasGrayNoBg && hasDarkGray;
      
      return { ...tech, displayIcon, isComplete };
    })
    .filter(tech => {
      // Filter by completion status if enabled
      if (showOnlyIncomplete) {
        return !tech.isComplete;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return (b._creationTime || 0) - (a._creationTime || 0);
      } else {
        return a.company_name.localeCompare(b.company_name);
      }
    });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Technologies</h1>
          <p className="text-muted-foreground">Manage your technology stack icons and details.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleFindDuplicates} className="gap-2">
            <AlertTriangle className="w-4 h-4" /> Find Duplicates
          </Button>
          <Button variant="outline" onClick={handleCopyIncompleteJSON} className="gap-2">
            <Copy className="w-4 h-4" /> Copy Incomplete JSON
          </Button>
          <Button onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" /> Add Technology
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Category Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-12' : 'w-64'} flex-shrink-0 transition-all duration-300`}>
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                {!sidebarCollapsed && (
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Categories</h3>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            {!sidebarCollapsed && (
              <div className="space-y-1">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Categories
                  <span className="ml-auto text-xs opacity-50">{techs?.length || 0}</span>
                </Button>
                {categoryEnum.map((cat) => {
                  const count = techs?.filter(t => t.details?.category === cat).length || 0;
                  return (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                      <span className="ml-auto text-xs opacity-50">{count}</span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              <Button 
              variant={selectedVariantId === "all" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSelectedVariantId("all")}
              className="rounded-full"
            >
              All Tech
            </Button>
            {variants?.map((v) => {
              const count = techs?.filter(t => 
                t.allIcons?.some(icon => icon.variant_id === v._id)
              ).length || 0;
              return (
                <Button 
                  key={v._id} 
                  variant={selectedVariantId === v._id ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setSelectedVariantId(v._id)}
                  className="rounded-full gap-2"
                >
                  {v.name}
                  <span className="opacity-50 text-[10px] bg-muted px-1.5 rounded-full">{count}</span>
                </Button>
              );
            })}
            </div>
            <div className="flex gap-2">
              <Button
                variant={showOnlyIncomplete ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyIncomplete(!showOnlyIncomplete)}
                className="gap-2"
              >
                <CheckCircle2 className="w-3 h-3" />
                {showOnlyIncomplete ? "Incomplete Only" : "All"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy(sortBy === "recent" ? "name" : "recent")}
                className="gap-2"
              >
                <ArrowUpDown className="w-3 h-3" />
                {sortBy === "recent" ? "Recent" : "A-Z"}
              </Button>
            </div>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>{editingTech ? `Edit ${editingTech.company_name}` : "Add New Technology"}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto pr-2">
                <TechnologyForm 
                    initialData={editingTech ? { ...editingTech, allIcons: editingTech.allIcons, variants } : undefined} 
                    onSuccess={() => {
                        setIsModalOpen(false);
                        setEditingTech(null);
                    }} 
                />
              </div>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {techs === undefined ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl border-2 border-dashed" />
              ))
            ) : filteredTechs?.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-muted/50 rounded-xl border-2 border-dashed">
                <p>No technologies found matching your filters.</p>
              </div>
            ) : (
              filteredTechs?.map((tech) => {
                return (
                  <div
                    key={tech._id}
                    className="group relative bg-card hover:bg-accent transition-all duration-300 rounded-xl border p-4 flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-md"
                  >
                    {tech.isComplete && (
                      <div className="absolute top-2 right-2 z-10">
                        <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500" />
                      </div>
                    )}
                    <div 
                      className="w-16 h-16 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform duration-300"
                    >
                      {tech.displayIcon?.file_url ? (
                        <img src={tech.displayIcon.file_url} alt={tech.company_name} className="w-full h-full object-contain" />
                      ) : (
                        <CircleX className="w-12 h-12 text-muted-foreground/20" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-center line-clamp-1">{tech.company_name}</span>
                    
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center gap-2">
                      <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(tech)}>
                        <Settings2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(tech._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
