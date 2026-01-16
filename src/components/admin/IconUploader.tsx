"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import { useUploadThing } from "@/lib/uploadthing";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Button } from "@/components/shadcn/button";
import { Upload, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "~/convex/_generated/dataModel";

interface IconUploaderProps {
  techId: Id<"tech">;
  variants?: any[];
  onUploadComplete?: () => void;
}

export function IconUploader({ techId, variants, onUploadComplete }: IconUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [version, setVersion] = useState<number>(1);
  const updateTechIconUrls = useMutation(api.technologies.updateTechIconUrls);

  const { startUpload, routeConfig } = useUploadThing("techIconUploader", {
    onClientUploadComplete: async (res) => {
      if (!res || res.length === 0) return;

      // Match uploaded files to variants based on filename
      const iconUpdates: Array<{ variant_id: Id<"tech_icon_variant">; file_url: string }> = [];

      for (const file of res) {
        const filename = file.name.toLowerCase();
        let variantName = "";

        if (filename.includes("-color-logo")) {
          variantName = "color-no-bg";
        } else if (filename.includes("-dark-gray-logo")) {
          variantName = "darkGray";
        } else if (filename.includes("-gray-logo")) {
          variantName = "gray-no-bg";
        } else if (filename.includes("-color-invert-logo")) {
          variantName = "color-invert-no-bg";
        }

        if (variantName && variants) {
          const variant = variants.find(v => v.name.toLowerCase() === variantName.toLowerCase());
          if (variant) {
            iconUpdates.push({
              variant_id: variant._id,
              file_url: file.url,
            });
          }
        }
      }

      // Update Convex with the new URLs
      if (iconUpdates.length > 0) {
        try {
          await updateTechIconUrls({
            tech_id: techId,
            icons: iconUpdates,
            version: version,
          });
          toast.success(`Updated ${iconUpdates.length} icon variant(s) (v${version})!`);
          onUploadComplete?.();
        } catch (error) {
          console.error("Failed to update icons:", error);
          toast.error("Failed to save icon URLs");
        }
      }

      setFiles([]);
      setUploading(false);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      toast.error("Upload failed");
      setUploading(false);
    },
    onUploadBegin: ({ file }) => {
      console.log("Uploading:", file);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: routeConfig ? generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ) : { "image/*": [] },
    multiple: true,
  });

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    await startUpload(files);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-sm">Drop files here...</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Drag & drop icon files here, or click to select
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Select Version</p>
            <div className="flex gap-2">
              {[1, 2, 3].map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant={version === v ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVersion(v)}
                  className="w-10 h-10 p-0"
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
          <p className="text-sm font-medium">{files.length} file(s) selected:</p>
          <div className="space-y-1">
            {files.map((file, idx) => {
              const filename = file.name.toLowerCase();
              let variant = "Unknown";
              let icon = <XCircle className="w-4 h-4 text-red-500" />;

              if (filename.includes("-color-logo")) {
                variant = "Color";
                icon = <CheckCircle2 className="w-4 h-4 text-green-500" />;
              } else if (filename.includes("-dark-gray-logo")) {
                variant = "Dark Gray";
                icon = <CheckCircle2 className="w-4 h-4 text-green-500" />;
              } else if (filename.includes("-gray-logo")) {
                variant = "Gray";
                icon = <CheckCircle2 className="w-4 h-4 text-green-500" />;
              } else if (filename.includes("-color-invert-logo")) {
                variant = "Color Invert";
                icon = <CheckCircle2 className="w-4 h-4 text-green-500" />;
              }

              return (
                <div key={idx} className="flex items-center gap-2 text-xs p-2 bg-muted/30 rounded">
                  {icon}
                  <span className="flex-1 font-mono truncate">{file.name}</span>
                  <span className="text-muted-foreground">→ {variant}</span>
                </div>
              );
            })}
          </div>
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {files.length} file(s)
              </>
            )}
          </Button>
        </div>
      </div>
      )}
    </div>
  );
}
