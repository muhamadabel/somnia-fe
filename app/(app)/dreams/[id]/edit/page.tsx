import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { DreamForm } from "@/components/dream/dream-form";

export const metadata = { title: "Ubah Mimpi" };

export default async function EditDreamPage({ params }: { params: Promise<{ id: string }> }) {
  const user = (await getCurrentUser())!;
  const { id } = await params;
  const dream = await db.dream.findFirst({ where: { id, userId: user.id, deletedAt: null } });
  if (!dream) notFound();

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
          dreamDate: dream.dreamDate.toISOString().slice(0, 10),
          isDraft: dream.isDraft,
          imagePath: dream.imagePath,
        }}
      />
    </>
  );
}
