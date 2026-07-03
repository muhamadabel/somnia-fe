import { PageHeader } from "@/components/layout/page-header";
import { DreamForm } from "@/components/dream/dream-form";

export const metadata = { title: "Catat Mimpi" };

export default function NewDreamPage() {
  return (
    <>
      <PageHeader
        title="Catat mimpimu ✨"
        subtitle="Tangkap sebelum memudar — fragmen pun boleh. Analisis AI berjalan setelah disimpan."
      />
      <DreamForm />
    </>
  );
}
