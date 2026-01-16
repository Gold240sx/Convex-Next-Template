"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Button } from "@/components/shadcn/button";
import { Plus, Pencil, Trash2, ExternalLink, GraduationCap } from "lucide-react";
import { Id } from "~/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { CertificateForm } from "@/components/admin/CertificateForm";

export default function CertificatesPage() {
  const certs = useQuery(api.certificates.list);
  const deleteCert = useMutation(api.certificates.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<any>(null);

  const handleDelete = async (id: Id<"certificates">) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      try {
        await deleteCert({ id });
        toast.success("Certificate deleted");
      } catch (error) {
        toast.error("Failed to delete certificate");
      }
    }
  };

  const handleEdit = (cert: any) => {
    setEditingCert(cert);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCert(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Certificates & Education</h1>
          <p className="text-muted-foreground">Manage your completed courses and achievements.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" /> Add Certificate
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingCert ? `Edit ${editingCert.name}` : "Add New Certificate"}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <CertificateForm 
                initialData={editingCert} 
                onSuccess={() => {
                    setIsModalOpen(false);
                    setEditingCert(null);
                }} 
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs === undefined ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
          ))
        ) : certs.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-muted/50 rounded-xl border-2 border-dashed">
            <p>No certificates found. Add your first achievement!</p>
          </div>
        ) : (
          certs.map((cert) => (
            <div
              key={cert._id}
              className="group relative bg-card hover:bg-accent transition-all duration-300 rounded-xl border shadow-sm p-6 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(cert)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(cert._id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">{cert.platform} • {cert.instructor}</p>
              </div>

              <div className="flex flex-wrap gap-1 mt-auto">
                  {cert.tech.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-0.5 bg-secondary text-[10px] rounded-full">{t}</span>
                  ))}
                  {cert.tech.length > 3 && <span className="text-[10px] text-muted-foreground">+{cert.tech.length - 3} more</span>}
              </div>

              <div className="flex items-center justify-between pt-4 border-t text-xs">
                  <span className="font-medium">{cert.completed_month} {cert.completed_year}</span>
                  {cert.certificate_link && (
                      <a href={cert.certificate_link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          View Cert <ExternalLink className="w-3 h-3" />
                      </a>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
