"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificateSchema, CertificateFormValues } from "@/lib/validations/certificate";
import { monthEnum } from "@/lib/validations/technology";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { X, Plus } from "lucide-react";

interface CertificateFormProps {
  initialData?: CertificateFormValues & { _id: Id<"certificates"> };
  onSuccess?: () => void;
}

export function CertificateForm({ initialData, onSuccess }: CertificateFormProps) {
  const createCert = useMutation(api.certificates.create);
  const updateCert = useMutation(api.certificates.update);
  const techs = useQuery(api.technologies.list);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema) as any,
    defaultValues: initialData ? {
        ref_id: initialData.ref_id,
        name: initialData.name,
        instructor: initialData.instructor,
        platform: initialData.platform,
        course_link: initialData.course_link,
        tech: initialData.tech,
        description: initialData.description,
        certificate_link: initialData.certificate_link,
        completed_month: initialData.completed_month as any,
        completed_year: initialData.completed_year,
        tags: initialData.tags,
        current_course: initialData.current_course,
        est_completion: initialData.est_completion,
        modules: initialData.modules,
        image: initialData.image,
    } : {
      ref_id: "",
      name: "",
      instructor: "",
      platform: "",
      course_link: "",
      tech: [],
      description: "",
      certificate_link: "",
      completed_month: "",
      completed_year: new Date().getFullYear(),
      tags: [],
      current_course: false,
      est_completion: 0,
      modules: [],
      image: "",
    },
  });

  const selectedTechs = watch("tech") || [];
  const selectedTags = watch("tags") || [];

  const onSubmit = async (values: CertificateFormValues) => {
    try {
      const data = {
        ...values,
        modules: values.modules ?? [],
        image: values.image ?? "",
      };

      if (initialData?._id) {
        await updateCert({
          id: initialData._id,
          ...data,
        } as any);
        toast.success("Certificate updated successfully");
      } else {
        await createCert(data as any);
        toast.success("Certificate created successfully");
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  const addTech = (t: string) => {
    if (!selectedTechs.includes(t)) {
      setValue("tech", [...selectedTechs, t]);
    }
  };

  const removeTech = (t: string) => {
    setValue("tech", selectedTechs.filter(x => x !== t));
  };

  const addTag = () => {
      const tag = prompt("Enter tag:");
      if (tag && !selectedTags.includes(tag)) {
          setValue("tags", [...selectedTags, tag]);
      }
  };

  const removeTag = (t: string) => {
      setValue("tags", selectedTags.filter(x => x !== t));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-bottom pb-2">Course Details</h3>
          <div>
            <label className="text-sm font-medium">Reference ID</label>
            <Input {...register("ref_id")} placeholder="e.g. UC-12345" />
          </div>
          <div>
            <label className="text-sm font-medium">Course Name</label>
            <Input {...register("name")} placeholder="Full Stack Web Dev" />
          </div>
          <div>
            <label className="text-sm font-medium">Instructor</label>
            <Input {...register("instructor")} placeholder="John Doe" />
          </div>
          <div>
            <label className="text-sm font-medium">Platform</label>
            <Input {...register("platform")} placeholder="Udemy, Coursera..." />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-bottom pb-2">Links & Media</h3>
          <div>
            <label className="text-sm font-medium">Course Link</label>
            <Input {...register("course_link")} placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium">Certificate Link</label>
            <Input {...register("certificate_link")} placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium">Cover Image URL</label>
            <Input {...register("image")} placeholder="https://..." />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" {...register("current_course")} id="current" />
            <label htmlFor="current" className="text-sm">Currently taking this course</label>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Technologies & Tags</h3>
        <div className="flex flex-wrap gap-2 mb-2">
            {selectedTechs.map(t => (
                <span key={t} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
                    {t} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTech(t)} />
                </span>
            ))}
        </div>
        <select 
            className="w-full h-10 px-3 py-2 text-sm bg-background border rounded-md"
            onChange={(e) => {
                if (e.target.value) addTech(e.target.value);
                e.target.value = "";
            }}
        >
            <option value="">Add Technology...</option>
            {techs?.map(t => (
                <option key={t._id} value={t.company_name}>{t.company_name}</option>
            ))}
        </select>

        <div className="flex flex-wrap gap-2 mt-4">
            {selectedTags.map(t => (
                <span key={t} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center gap-1">
                    {t} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(t)} />
                </span>
            ))}
            <Button type="button" variant="outline" size="sm" className="h-6 px-2 text-xs" onClick={addTag}>
                <Plus className="w-3 h-3 mr-1" /> Add Tag
            </Button>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold">Completion Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium">Completed Year</label>
              <Input type="number" {...register("completed_year")} />
            </div>
            <div>
              <label className="text-sm font-medium">Completed Month</label>
              <select {...register("completed_month")} className="w-full h-10 px-3 py-2 text-sm bg-background border rounded-md">
                {monthEnum.map(m => <option key={m} value={m}>{m || "Select Month"}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Est. Completion Hours (if current)</label>
              <Input type="number" {...register("est_completion")} />
            </div>
          </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
          <label className="text-sm font-medium">Course Description</label>
          <Textarea {...register("description")} rows={5} placeholder="What did you learn?" />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Saving..." : initialData ? "Update Certificate" : "Add Certificate"}
        </Button>
      </div>
    </form>
  );
}
