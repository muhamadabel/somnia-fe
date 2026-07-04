"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { DreamForm } from "@/components/dream/dream-form";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/use-api";

interface DreamEdit {
  id: string;
  title: string | null;
  description: string;
  notes: string | null;
  mood: string | null;
  sleepDuration: number | null;
  dreamDate: string;
  isDraft: boolean;
  imagePath: string | null;
}

export default function EditDreamPage() {
  const { id } = useParams<{ id: string }>();
  const { data: dream, loading } = useApi<DreamEdit>(`/api/dreams/${id}`, [id]);

  if (loading || !dream) return <PageSkeleton />;

  return (
    <>
      <PageHeader title="Ubah mimpi" subtitle="Catatan asli tetap tersimpan berversi di analisismu." />
      <DreamForm
        initial={{
          id: dream.id,
          title: dream.title ?? "",
          description: dream.description,
          notes: dream.notes ?? "",
          mood: dream.mood ?? "",
          sleepDuration: dream.sleepDuration?.toString() ?? "",
          dreamDate: dream.dreamDate.slice(0, 10),
          isDraft: dream.isDraft,
          imagePath: dream.imagePath,
        }}
      />
    </>
  );
}
