import React, { useRef } from 'react';
import { Label } from '@/components/shadcn/label';
import { Button } from '@/components/shadcn/button';
import { Upload, X, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploadFieldProps {
  label?: string;
  helpText?: string;
  value?: File[];
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  required?: boolean;
  accept?: string; // e.g., "image/*" or ".pdf,.doc"
  maxFiles?: number;
  maxSize?: number; // in bytes
  className?: string;
  id?: string;
}

export function FileUploadField({
  label,
  helpText,
  value = [],
  onChange,
  disabled = false,
  required = false,
  accept,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
  id,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldId = id || `file-upload-${React.useId()}`;
  const helpTextId = helpText ? `${fieldId}-help` : undefined;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Filter by size
    const validFiles = files.filter(file => file.size <= maxSize);
    
    // Limit number of files
    const newFiles = [...value, ...validFiles].slice(0, maxFiles);
    
    onChange?.(newFiles);
    
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-3 ${className || ''}`} role="group" aria-labelledby={label ? `${fieldId}-label` : undefined}>
      {label && (
        <Label id={`${fieldId}-label`}>
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </Label>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || value.length >= maxFiles}
          className="gap-2"
          aria-controls={fieldId}
        >
          <Upload className="w-4 h-4" aria-hidden="true" />
          Choose Files
        </Button>
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {value.length} / {maxFiles} files
        </span>
      </div>

      <input
        ref={inputRef}
        id={fieldId}
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
        required={required && value.length === 0}
        accept={accept}
        multiple={maxFiles > 1}
        className="hidden"
        aria-describedby={helpTextId}
      />

      {/* File List */}
      {value.length > 0 && (
        <div className="space-y-2" aria-label="Uploaded files">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
              role="listitem"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="shrink-0"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {helpText && (
        <p id={helpTextId} className="text-xs text-muted-foreground" role="note">{helpText}</p>
      )}
      
      <p className="text-xs text-muted-foreground" role="note">
        Max file size: {formatFileSize(maxSize)}
        {accept && ` • Accepted: ${accept}`}
      </p>
    </div>
  );
}
