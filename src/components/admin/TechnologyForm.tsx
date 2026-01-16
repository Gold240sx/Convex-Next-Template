"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  technologySchema,
  monthEnum,
  categoryEnum,
  ratingEnum,
} from "@/lib/validations/technology";
import { ITechnologyFormValues, ITechnologyWithMeta } from "@/types/technology";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Zap, Code2, Info, LayoutIcon, Star, Check, Copy, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Label } from "@/components/shadcn/label";
import { Switch } from "@/components/shadcn/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { Separator } from "@/components/shadcn/separator";

import { IconUploader } from "./IconUploader";
import { LEGACY_VARIANT_MAP, MONTH_MAP, CATEGORY_MAP } from "@/lib/constants/legacy-mapping";

interface TechnologyFormProps {
  initialData?: ITechnologyWithMeta;
  onSuccess?: () => void;
}


export function TechnologyForm({ initialData, onSuccess }: TechnologyFormProps) {
  const createTech = useMutation(api.technologies.create);
  const updateTech = useMutation(api.technologies.update);
  const addIconVariant = useMutation(api.technologies.addIconVariant);
  const variants = useQuery(api.technologies.listIconVariants);

  // Calculate available versions
  const availableVersions = React.useMemo(() => {
    const icons = initialData?.allIcons;
    if (!icons) return [1];
    const maxVer = Math.max(1, ...icons.map((i: any) => i.version || 1));
    return Array.from({ length: maxVer }, (_, i) => i + 1);
  }, [initialData?.allIcons]);

  // State for the three main variant file URLs
  const [currentVersion, setCurrentVersion] = React.useState(1);
  const [colorUrl, setColorUrl] = React.useState("");
  const [grayUrl, setGrayUrl] = React.useState("");
  const [darkGrayUrl, setDarkGrayUrl] = React.useState("");
  const [colorInvertUrl, setColorInvertUrl] = React.useState("");

  // Initialize URL states from initialData
  React.useEffect(() => {
    const icons = initialData?.allIcons;
    if (icons && variants) {
      const colorVariant = variants.find(v => v.name.toLowerCase() === "color-no-bg");
      const grayVariant = variants.find(v => v.name.toLowerCase() === "gray-no-bg");
      const darkGrayVariant = variants.find(v => v.name.toLowerCase() === "darkgray");
      const colorInvertVariant = variants.find(v => v.name.toLowerCase() === "color-invert-no-bg");

      const findIcon = (variantId: string) => {
        return icons.find((i: any) => 
          i.variant_id === variantId && (i.version || 1) === currentVersion
        );
      };

      if (colorVariant) {
        const icon = findIcon(colorVariant._id);
        setColorUrl(icon?.file_url || "");
      }
      if (grayVariant) {
        const icon = findIcon(grayVariant._id);
        setGrayUrl(icon?.file_url || "");
      }
      if (darkGrayVariant) {
        const icon = findIcon(darkGrayVariant._id);
        setDarkGrayUrl(icon?.file_url || "");
      }
      if (colorInvertVariant) {
        const icon = findIcon(colorInvertVariant._id);
        setColorInvertUrl(icon?.file_url || "");
      }
    }
  }, [initialData, variants, currentVersion]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ITechnologyFormValues>({
    resolver: zodResolver(technologySchema),
    defaultValues: initialData ? {
      company_name: initialData.company_name,
      icon: {
        should_invert_on_dark: !!initialData.icon?.should_invert_on_dark,
        version: initialData.icon?.version ?? 1,
        variant_id: initialData.icon?.variant_id ?? "",
      },
      details: {
        website_url: initialData.details?.website_url ?? "",
        category: (initialData.details?.category as any) ?? "",
        my_stack: !!initialData.details?.my_stack,
        is_favorite: !!initialData.details?.is_favorite,
        use_case: initialData.details?.use_case ?? "",
        my_experience: initialData.details?.my_experience ?? "",
        description: initialData.details?.description ?? "",
        purchased: !!initialData.details?.purchased,
        year_began_using: initialData.details?.year_began_using ?? new Date().getFullYear(),
        monthBeganUsing: (initialData.details?.monthBeganUsing as any) ?? "",
        skill_level: (initialData.details?.skill_level as any) ?? "",
        rating: (initialData.details?.rating as any) ?? "",
        comment: initialData.details?.comment ?? "",
      }
    } : {
      company_name: "",
      icon: {
        file_url: "",
        should_invert_on_dark: false,
        version: 1,
        variant_id: "",
      },
      details: {
        website_url: "",
        category: "" as any,
        my_stack: false,
        is_favorite: false,
        use_case: "",
        my_experience: "",
        description: "",
        purchased: false,
        year_began_using: new Date().getFullYear(),
        monthBeganUsing: "" as any,
        skill_level: "" as any,
        rating: "" as any,
        comment: "",
      },
    },
  });


  const [isQuickAddOpen, setIsQuickAddOpen] = React.useState(false);
  const [quickAddJson, setQuickAddJson] = React.useState("");

  const handleQuickAdd = async () => {
    try {
      const data = JSON.parse(quickAddJson);
      const items = Array.isArray(data) ? data : [data];
      
      if (items.length === 0) throw new Error("No data found");

      const normalizeCategory = (cat: string) => {
        if (!cat) return "Library";
        const normalized = cat.toLowerCase().trim();
        if (CATEGORY_MAP[normalized]) return CATEGORY_MAP[normalized];
        const found = categoryEnum.find(c => c.toLowerCase() === normalized);
        return found || "Library";
      };

      const normalizeMonth = (m: string) => {
        if (!m) return "";
        return MONTH_MAP[m.toLowerCase()] || "";
      };

      const normalizeVariant = (legacyId: string) => {
        if (!legacyId) return "";
        const legacyName = LEGACY_VARIANT_MAP[legacyId];
        if (!legacyName) return "";
        const currentVariant = variants?.find(v => v.name.toLowerCase() === legacyName.toLowerCase());
        return currentVariant?._id || "";
      };

      const toastId = toast.loading(`Importing ${items.length} technologies...`);
      let successCount = 0;

      for (const item of items) {
        try {
          const mutationData = {
            company_name: item.company_name || "Unknown",
            oldId: item.id || undefined,
            icon: {
              file_url: item.file_url || "",
              should_invert_on_dark: !!item.should_invert_on_dark,
              version: item.version || 1,
              variant_id: normalizeVariant(item.variant_id) || undefined,
            },
            details: {
              website_url: item.website_url || "",
              category: normalizeCategory(item.category) as any,
              my_stack: !!item.my_stack,
              is_favorite: !!item.is_favorite,
              use_case: item.use_case || "",
              my_experience: item.my_experience || "",
              description: item.description || "",
              purchased: !!item.purchased,
              year_began_using: (item.year_began_using && !isNaN(parseInt(item.year_began_using))) ? parseInt(item.year_began_using) : new Date().getFullYear(),
              monthBeganUsing: normalizeMonth(item.month_began_using) as any,
              skill_level: item.skill_level || "",
              rating: item.skill_level || "",
              comment: item.comment || "",
            }
          };

          await createTech(mutationData as any);
          successCount++;
        } catch (err) {
          console.error(`Failed to import ${item.company_name}:`, err);
        }
      }

      toast.dismiss(toastId);
      if (successCount === items.length) {
        toast.success(`Successfully imported all ${items.length} technologies!`);
      } else {
        toast.warning(`Imported ${successCount} of ${items.length} technologies. Check console for errors.`);
      }

      setIsQuickAddOpen(false);
      setQuickAddJson("");
      onSuccess?.(); // Refresh the list if it's on the main page
    } catch (err) {
      toast.error("Invalid JSON or import error");
      console.error(err);
    }
  };

  const onSubmit: SubmitHandler<ITechnologyFormValues> = async (data) => {
    try {
      const mutationData = {
        ...data,
        icon: {
          ...data.icon,
          variant_id: data.icon.variant_id ? (data.icon.variant_id as Id<"tech_icon_variant">) : undefined,
        },
        details: {
          ...data.details,
          category: data.details.category as any,
        }
      };

      if (initialData?._id) {
        await updateTech({
          id: initialData._id,
          ...mutationData,
        } as any);
        toast.success("Technology updated successfully");
      } else {
        await createTech(mutationData as any);
        toast.success("Technology created successfully");
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {initialData ? "Refine Technology" : "New Technology"}
          </h2>
          <p className="text-muted-foreground text-sm italic">
            Add to your digital arsenal.
          </p>
        </div>
        
        {!initialData && (
          <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-primary/20 hover:border-primary/50 transition-colors">
                <Zap className="w-4 h-4 text-amber-500" />
                Quick Add JSON
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Quick Add Technology</DialogTitle>
                <DialogDescription>
                  Paste your legacy JSON data here to auto-fill the form.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea 
                  placeholder='[{"company_name": "My Tech", ...}]' 
                  className="min-h-[200px] font-mono text-xs bg-muted/50"
                  value={quickAddJson}
                  onChange={(e) => setQuickAddJson(e.target.value)}
                />
                <Button onClick={handleQuickAdd} className="w-full">
                  Import & Auto-Fill
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section: Identity */}
          <motion.div variants={sectionVariants}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Info className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Core Identity</CardTitle>
                    <CardDescription>Primary information about the technology.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Technology Name</Label>
                  <Input 
                    {...register("company_name")} 
                    placeholder="e.g. Next.js" 
                    className="bg-background/50 focus:ring-primary/20"
                  />
                  {errors.company_name && <p className="text-destructive text-xs italic">{errors.company_name.message}</p>}
                </div>
                
                {/* Old ID - Copyable */}
                {initialData?.oldId && (
                  <div className="space-y-2">
                    <Label>Legacy ID (for bulk imports)</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={initialData.oldId}
                        readOnly
                        className="bg-muted/50 font-mono text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (!initialData?.oldId) { toast.error("No oldId found"); return}
                          navigator.clipboard.writeText(initialData?.oldId);
                          toast.success("Copied oldId");
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="website_url">Official Website</Label>
                  <Input 
                    {...register("details.website_url")} 
                    placeholder="https://..." 
                    className="bg-background/50 focus:ring-primary/20"
                  />
                  {errors.details?.website_url && <p className="text-destructive text-xs italic">{errors.details.website_url.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div className="space-y-2">
                    <Label>Category</Label>
                    <select 
                      {...register("details.category")} 
                      className="w-full h-10 px-3 py-2 text-sm bg-background/50 border rounded-md focus:ring-2 ring-primary/20 outline-none transition-all"
                    >
                        <option value="">Select Category</option>
                        {categoryEnum.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.details?.category && <p className="text-destructive text-xs italic">{errors.details.category.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Skill Level</Label>
                    <select 
                      {...register("details.skill_level")} 
                      className="w-full h-10 px-3 py-2 text-sm bg-background/50 border rounded-md focus:ring-2 ring-primary/20 outline-none transition-all"
                    >
                        <option value="">None</option>
                        {ratingEnum.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section: Visual Assets */}
          <motion.div variants={sectionVariants}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <LayoutIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Visual Representation</CardTitle>
                    <CardDescription>SVG branding and display variants.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                
                {/* Version Selector - Only show if multiple versions exist */}
                {availableVersions.length > 1 && (
                  <div className="flex items-center justify-between">
                    <Label>Icon Version</Label>
                    <div className="flex gap-2">
                      {availableVersions.map(v => (
                        <Button
                          key={v}
                          type="button"
                          size="sm"
                          variant={currentVersion === v ? "default" : "outline"}
                          onClick={() => setCurrentVersion(v)}
                          className="w-8 h-8 p-0"
                        >
                          {v}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Three Main Variant SVG Inputs */}
                <div className="space-y-4">
                  <Label>Main Variant Icon Files {availableVersions.length > 1 && `(v${currentVersion})`}</Label>
                  
                  {/* Color-No-Bg */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Color</Label>
                      {!colorUrl.trim() && <X className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex gap-2 items-center">
                      {colorUrl && (
                        <div className="w-8 h-8 shrink-0 bg-muted/50 rounded flex items-center justify-center p-1 border">
                          <img src={colorUrl} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <Input
                        value={colorUrl}
                        onChange={(e) => setColorUrl(e.target.value)}
                        placeholder="https://..."
                        className="font-mono text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(colorUrl);
                          toast.success("Copied Color URL");
                        }}
                        disabled={!colorUrl.trim()}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            setColorUrl(text);
                            toast.success("Pasted");
                          } catch (err) {
                            console.error("Paste failed:", err);
                            toast.error("Paste failed: Access denied");
                          }
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setColorUrl("")}
                        disabled={!colorUrl.trim()}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Gray-No-Bg */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Gray</Label>
                      {!grayUrl.trim() && <X className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex gap-2 items-center">
                      {grayUrl && (
                        <div className="w-8 h-8 shrink-0 bg-muted/50 rounded flex items-center justify-center p-1 border">
                          <img src={grayUrl} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <Input
                        value={grayUrl}
                        onChange={(e) => setGrayUrl(e.target.value)}
                        placeholder="https://..."
                        className="font-mono text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(grayUrl);
                          toast.success("Copied Gray URL");
                        }}
                        disabled={!grayUrl.trim()}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            setGrayUrl(text);
                            toast.success("Pasted");
                          } catch (err) {
                            console.error("Paste failed:", err);
                            toast.error("Paste failed: Access denied");
                          }
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setGrayUrl("")}
                        disabled={!grayUrl.trim()}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* DarkGray */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Dark Gray</Label>
                      {!darkGrayUrl.trim() && <X className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex gap-2 items-center">
                      {darkGrayUrl && (
                        <div className="w-8 h-8 shrink-0 bg-muted/50 rounded flex items-center justify-center p-1 border">
                          <img src={darkGrayUrl} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <Input
                        value={darkGrayUrl}
                        onChange={(e) => setDarkGrayUrl(e.target.value)}
                        placeholder="https://..."
                        className="font-mono text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(darkGrayUrl);
                          toast.success("Copied Dark Gray URL");
                        }}
                        disabled={!darkGrayUrl.trim()}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            setDarkGrayUrl(text);
                            toast.success("Pasted");
                          } catch (err) {
                            console.error("Paste failed:", err);
                            toast.error("Paste failed: Access denied");
                          }
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setDarkGrayUrl("")}
                        disabled={!darkGrayUrl.trim()}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Color-Invert-No-Bg (NEW) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Color Invert</Label>
                      {!colorInvertUrl.trim() && <X className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex gap-2 items-center">
                      {colorInvertUrl && (
                        <div className="w-8 h-8 shrink-0 bg-muted/50 rounded flex items-center justify-center p-1 border">
                          <img src={colorInvertUrl} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <Input
                        value={colorInvertUrl}
                        onChange={(e) => setColorInvertUrl(e.target.value)}
                        placeholder="https://..."
                        className="font-mono text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(colorInvertUrl);
                          toast.success("Copied Invert URL");
                        }}
                        disabled={!colorInvertUrl.trim()}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            setColorInvertUrl(text);
                            toast.success("Pasted");
                          } catch (err) {
                            console.error("Paste failed:", err);
                            toast.error("Paste failed: Access denied");
                          }
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setColorInvertUrl("")}
                        disabled={!colorInvertUrl.trim()}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                </div>
                
                
                {/* Multi-File Upload Dropzone */}
                {initialData?._id && (
                  <div className="space-y-2 border-2 border-dashed rounded-lg p-6 bg-muted/20">
                    <Label>Bulk Icon Upload</Label>
                    <p className="text-xs text-muted-foreground mb-4">
                      Drop multiple icon files here. Files ending with:
                      <br />• <code className="bg-muted px-1 rounded">-color-logo</code> → Color variant
                      <br />• <code className="bg-muted px-1 rounded">-gray-logo</code> → Gray variant
                      <br />• <code className="bg-muted px-1 rounded">-dark-gray-logo</code> → Dark Gray variant
                      <br />• <code className="bg-muted px-1 rounded">-color-invert-logo</code> → Color Invert variant
                    </p>
                    <IconUploader 
                      techId={initialData._id} 
                      variants={initialData.variants}
                      onUploadComplete={() => {
                        toast.success("Icons uploaded successfully!");
                        // Refresh the form data
                        window.location.reload();
                      }}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Display Version</Label>
                    <Input type="number" {...register("icon.version", { valueAsNumber: true })} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Variant</Label>
                    <div className="flex gap-1.5">
                      <select 
                        {...register("icon.variant_id")} 
                        className="flex-1 h-10 px-3 py-2 text-sm bg-background/50 border rounded-md outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                      >
                        <option value="">Default</option>
                        {variants?.map(v => (
                          <option key={v._id} value={v._id}>{v.name}</option>
                        )) || []}
                      </select>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="icon"
                        className="h-10 w-10 shrink-0"
                        onClick={() => {
                          const name = prompt("Enter new variant name:");
                          if (name) {
                            addIconVariant({ name }).then(() => {
                              toast.success("Variant added");
                            });
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 border-border/40">
                  <div className="space-y-0.5">
                    <Label htmlFor="invert" className="text-sm font-medium">Invert on Dark Mode</Label>
                    <p className="text-[10px] text-muted-foreground">Flips SVG colors for dark interfaces</p>
                  </div>
                  <Switch 
                    id="invert"
                    checked={watch("icon.should_invert_on_dark")}
                    onCheckedChange={(checked) => setValue("icon.should_invert_on_dark", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Section: Personal Context */}
        <motion.div variants={sectionVariants}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Experience & Narrative</CardTitle>
                  <CardDescription>Your personal history and perspective on this tech.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex items-center justify-between p-4 rounded-xl border bg-primary/5 border-primary/10 hover:bg-primary/10 transition-colors">
                      <Label htmlFor="my_stack" className="cursor-pointer font-semibold">Active Stack</Label>
                      <Switch 
                        id="my_stack"
                        checked={watch("details.my_stack")}
                        onCheckedChange={(checked) => setValue("details.my_stack", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                      <Label htmlFor="is_favorite" className="cursor-pointer font-semibold">Favorite</Label>
                      <Switch 
                        id="is_favorite"
                        checked={watch("details.is_favorite")}
                        onCheckedChange={(checked) => setValue("details.is_favorite", checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Primary Use Case</Label>
                      <Input {...register("details.use_case")} placeholder="e.g. Rapid UI Prototyping" className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Professional Experience</Label>
                      <Input {...register("details.my_experience")} placeholder="e.g. 5 projects across 2 years" className="bg-background/50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Public Description</Label>
                    <Textarea 
                      {...register("details.description")} 
                      placeholder="What is this technology known for?" 
                      className="bg-background/50 min-h-[120px] resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Year Started</Label>
                      <Input type="number" {...register("details.year_began_using", { valueAsNumber: true })} className="bg-background/50 h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Month Started</Label>
                      <select 
                        {...register("details.monthBeganUsing")} 
                        className="w-full h-9 px-2 text-xs bg-background/50 border rounded-md outline-none"
                      >
                          <option value="">None</option>
                          {monthEnum.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Overall Rating</Label>
                      <select 
                        {...register("details.rating")} 
                        className="w-full h-9 px-2 text-xs bg-background/50 border rounded-md outline-none"
                      >
                          <option value="">None</option>
                          {ratingEnum.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border bg-emerald-500/5 border-emerald-500/10">
                    <div className="space-y-0.5">
                      <Label htmlFor="purchased" className="text-sm font-medium">Licensed / Purchased</Label>
                      <p className="text-[10px] text-muted-foreground italic">Do you pay for this service or tool?</p>
                    </div>
                    <Check 
                      className={`w-5 h-5 transition-all cursor-pointer ${watch("details.purchased") ? 'text-emerald-500 scale-110' : 'text-muted-foreground/30'}`}
                      onClick={() => setValue("details.purchased", !watch("details.purchased"))}
                    />
                    <input type="hidden" {...register("details.purchased")} />
                  </div>

                  <div className="space-y-2">
                    <Label>Personal Commentary (Internal)</Label>
                    <Textarea 
                      {...register("details.comment")} 
                      placeholder="Your secret thoughts on this tech..." 
                      className="bg-background/50 min-h-[145px] border-dashed"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          variants={sectionVariants}
          className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 sticky bottom-0 bg-background/80 backdrop-blur-md p-4 border-t z-10 -mx-1"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => window.history.back()}
            disabled={isSubmitting}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full sm:w-auto min-w-[200px] h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-2 order-1 sm:order-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {initialData ? "Apply Changes" : "Deploy Technology"}
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
}
