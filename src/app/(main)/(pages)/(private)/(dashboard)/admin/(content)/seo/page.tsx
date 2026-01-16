"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Id } from "~/convex/_generated/dataModel"
import { 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff,
    Globe,
    Facebook,
    Twitter,
    Linkedin,
    ExternalLink,
    Save,
    X
} from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Label } from "@/components/shadcn/label"
import { Textarea } from "@/components/shadcn/textarea"
import { Switch } from "@/components/shadcn/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/dialog"
import { Badge } from "@/components/shadcn/badge"
import { Separator } from "@/components/shadcn/separator"
import { cn } from "@/lib/utils"

export default function SeoManagementPage() {
    const seoEntries = useQuery(api.seoMetadata.listAllSeo)
    const upsertSeo = useMutation(api.seoMetadata.upsertSeoMetadata)
    const deleteSeo = useMutation(api.seoMetadata.deleteSeo)
    const toggleActive = useMutation(api.seoMetadata.toggleSeoActive)

    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingEntry, setEditingEntry] = useState<any>(null)
    const [previewEntry, setPreviewEntry] = useState<any>(null)

    // Form state
    const [formData, setFormData] = useState({
        pagePath: "",
        pageTitle: "",
        metaDescription: "",
        keywords: [] as string[],
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        ogImageAlt: "",
        twitterCard: "summary_large_image" as const,
        twitterTitle: "",
        twitterDescription: "",
        twitterImage: "",
        canonicalUrl: "",
        robots: "index, follow",
        isActive: true,
        priority: 0.5,
        changeFrequency: "weekly" as const,
    })

    const filteredEntries = seoEntries?.filter(entry =>
        entry.pagePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.pageTitle.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEdit = (entry: any) => {
        setEditingEntry(entry)
        setFormData({
            pagePath: entry.pagePath,
            pageTitle: entry.pageTitle,
            metaDescription: entry.metaDescription,
            keywords: entry.keywords || [],
            ogTitle: entry.ogTitle || "",
            ogDescription: entry.ogDescription || "",
            ogImage: entry.ogImage || "",
            ogImageAlt: entry.ogImageAlt || "",
            twitterCard: entry.twitterCard || "summary_large_image",
            twitterTitle: entry.twitterTitle || "",
            twitterDescription: entry.twitterDescription || "",
            twitterImage: entry.twitterImage || "",
            canonicalUrl: entry.canonicalUrl || "",
            robots: entry.robots || "index, follow",
            isActive: entry.isActive,
            priority: entry.priority || 0.5,
            changeFrequency: entry.changeFrequency || "weekly",
        })
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        setEditingEntry(null)
        setFormData({
            pagePath: "",
            pageTitle: "",
            metaDescription: "",
            keywords: [],
            ogTitle: "",
            ogDescription: "",
            ogImage: "",
            ogImageAlt: "",
            twitterCard: "summary_large_image",
            twitterTitle: "",
            twitterDescription: "",
            twitterImage: "",
            canonicalUrl: "",
            robots: "index, follow",
            isActive: true,
            priority: 0.5,
            changeFrequency: "weekly",
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = async () => {
        await upsertSeo(formData)
        setIsDialogOpen(false)
        setEditingEntry(null)
    }

    const handleDelete = async (id: Id<"seo_metadata">) => {
        if (confirm("Are you sure you want to delete this SEO entry?")) {
            await deleteSeo({ id })
        }
    }

    const handleToggleActive = async (id: Id<"seo_metadata">, isActive: boolean) => {
        await toggleActive({ id, isActive })
    }

    if (seoEntries === undefined) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight italic uppercase">SEO Management</h1>
                    <p className="text-muted-foreground mt-2">Manage meta tags, Open Graph, and Twitter Cards for all pages</p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add SEO Entry
                </Button>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-teal-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-teal-500/10 rounded-lg shrink-0">
                        <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-bold text-lg">How to Use SEO Management</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-teal-600 dark:text-teal-400">📝 Creating SEO Entries</h4>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• Click "Add SEO Entry" to create new metadata</li>
                                    <li>• Enter the page path (e.g., <code className="bg-muted px-1 rounded">/about</code> or <code className="bg-muted px-1 rounded">/blog/[slug]</code>)</li>
                                    <li>• Fill in title (60 chars max) and description (160 chars max)</li>
                                    <li>• Add Open Graph image for social media sharing</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-purple-600 dark:text-purple-400">🎯 Best Practices</h4>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• Use unique titles and descriptions for each page</li>
                                    <li>• OG images should be 1200x630px for best results</li>
                                    <li>• Set priority 0.8-1.0 for important pages</li>
                                    <li>• Use "index, follow" for public pages</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400">🔍 Page Paths</h4>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• Static: <code className="bg-muted px-1 rounded">/</code>, <code className="bg-muted px-1 rounded">/about</code>, <code className="bg-muted px-1 rounded">/contact</code></li>
                                    <li>• Dynamic: <code className="bg-muted px-1 rounded">/blog/[slug]</code>, <code className="bg-muted px-1 rounded">/products/[id]</code></li>
                                    <li>• Nested: <code className="bg-muted px-1 rounded">/docs/[category]/[page]</code></li>
                                    <li>• The system auto-applies SEO to matching routes</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-orange-600 dark:text-orange-400">⚡ Quick Actions</h4>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• Toggle switch to enable/disable SEO instantly</li>
                                    <li>• Click <Eye className="w-3 h-3 inline" /> to preview how it looks</li>
                                    <li>• Click <Edit className="w-3 h-3 inline" /> to edit existing entries</li>
                                    <li>• SEO changes apply immediately to your site</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                            <ExternalLink className="w-3 h-3" />
                            <span>Need help? Check out the <a href="/docs/SEO_MANAGEMENT.md" className="text-teal-600 hover:underline">full documentation</a></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by page path or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* SEO Entries Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-4 font-bold text-sm">Page Path</th>
                                <th className="text-left p-4 font-bold text-sm">Title</th>
                                <th className="text-left p-4 font-bold text-sm">Status</th>
                                <th className="text-left p-4 font-bold text-sm">Priority</th>
                                <th className="text-right p-4 font-bold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEntries && filteredEntries.length > 0 ? (
                                filteredEntries.map((entry) => (
                                    <tr key={entry._id} className="border-t border-border hover:bg-muted/20 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-muted-foreground" />
                                                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{entry.pagePath}</code>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="max-w-md">
                                                <p className="font-semibold text-sm truncate">{entry.pageTitle}</p>
                                                <p className="text-xs text-muted-foreground truncate">{entry.metaDescription}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Switch
                                                checked={entry.isActive}
                                                onCheckedChange={(checked) => handleToggleActive(entry._id, checked)}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline">{entry.priority || 0.5}</Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setPreviewEntry(entry)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(entry)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(entry._id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                        No SEO entries found. Click "Add SEO Entry" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit/Create Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingEntry ? "Edit SEO Entry" : "Create SEO Entry"}</DialogTitle>
                        <DialogDescription>
                            Configure SEO metadata for this page. Leave fields empty to use defaults.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Basic Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <Label>Page Path *</Label>
                                    <Input
                                        placeholder="/about or /blog/[slug]"
                                        value={formData.pagePath}
                                        onChange={(e) => setFormData({ ...formData, pagePath: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Page Title *</Label>
                                    <Input
                                        placeholder="About Us - Your Company"
                                        value={formData.pageTitle}
                                        onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                                    />
                                    <p className="text-xs text-muted-foreground">{formData.pageTitle.length} / 60 characters</p>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Meta Description *</Label>
                                    <Textarea
                                        placeholder="A brief description of this page..."
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                        rows={3}
                                    />
                                    <p className="text-xs text-muted-foreground">{formData.metaDescription.length} / 160 characters</p>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Keywords (comma-separated)</Label>
                                    <Input
                                        placeholder="keyword1, keyword2, keyword3"
                                        value={formData.keywords.join(", ")}
                                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value.split(",").map(k => k.trim()) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Open Graph */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Facebook className="w-4 h-4" />
                                Open Graph (Facebook, LinkedIn)
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <Label>OG Title (defaults to Page Title)</Label>
                                    <Input
                                        placeholder={formData.pageTitle}
                                        value={formData.ogTitle}
                                        onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>OG Description (defaults to Meta Description)</Label>
                                    <Textarea
                                        placeholder={formData.metaDescription}
                                        value={formData.ogDescription}
                                        onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>OG Image URL</Label>
                                    <Input
                                        placeholder="https://example.com/og-image.jpg"
                                        value={formData.ogImage}
                                        onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>OG Image Alt Text</Label>
                                    <Input
                                        placeholder="Description of the image"
                                        value={formData.ogImageAlt}
                                        onChange={(e) => setFormData({ ...formData, ogImageAlt: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Twitter */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Twitter className="w-4 h-4" />
                                Twitter Card
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Card Type</Label>
                                    <Select
                                        value={formData.twitterCard}
                                        onValueChange={(val: any) => setFormData({ ...formData, twitterCard: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="summary">Summary</SelectItem>
                                            <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                                            <SelectItem value="app">App</SelectItem>
                                            <SelectItem value="player">Player</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Twitter Image</Label>
                                    <Input
                                        placeholder="https://example.com/twitter-image.jpg"
                                        value={formData.twitterImage}
                                        onChange={(e) => setFormData({ ...formData, twitterImage: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Technical SEO */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Technical SEO</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Canonical URL</Label>
                                    <Input
                                        placeholder="https://example.com/page"
                                        value={formData.canonicalUrl}
                                        onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Robots</Label>
                                    <Select
                                        value={formData.robots}
                                        onValueChange={(val) => setFormData({ ...formData, robots: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="index, follow">Index, Follow</SelectItem>
                                            <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                                            <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                                            <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Sitemap Priority (0.0 - 1.0)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Change Frequency</Label>
                                    <Select
                                        value={formData.changeFrequency}
                                        onValueChange={(val: any) => setFormData({ ...formData, changeFrequency: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="always">Always</SelectItem>
                                            <SelectItem value="hourly">Hourly</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                            <SelectItem value="never">Never</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 flex items-center justify-between border p-3 rounded-lg">
                                    <Label>Active</Label>
                                    <Switch
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>
                                <Save className="w-4 h-4 mr-2" />
                                Save SEO Entry
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            {previewEntry && (
                <Dialog open={!!previewEntry} onOpenChange={() => setPreviewEntry(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>SEO Preview</DialogTitle>
                            <DialogDescription>How this page will appear in search results and social media</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* Google Preview */}
                            <div className="space-y-2">
                                <h4 className="font-bold text-sm flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Google Search Result
                                </h4>
                                <div className="border border-border rounded-lg p-4 bg-muted/20">
                                    <div className="text-sm text-blue-600 hover:underline cursor-pointer">{previewEntry.pageTitle}</div>
                                    <div className="text-xs text-green-700 mt-1">https://yoursite.com{previewEntry.pagePath}</div>
                                    <div className="text-sm text-muted-foreground mt-2">{previewEntry.metaDescription}</div>
                                </div>
                            </div>

                            {/* Facebook Preview */}
                            {previewEntry.ogImage && (
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm flex items-center gap-2">
                                        <Facebook className="w-4 h-4" />
                                        Facebook / LinkedIn
                                    </h4>
                                    <div className="border border-border rounded-lg overflow-hidden bg-muted/20">
                                        <img src={previewEntry.ogImage} alt={previewEntry.ogImageAlt} className="w-full h-48 object-cover" />
                                        <div className="p-4">
                                            <div className="text-sm font-bold">{previewEntry.ogTitle || previewEntry.pageTitle}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{previewEntry.ogDescription || previewEntry.metaDescription}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
