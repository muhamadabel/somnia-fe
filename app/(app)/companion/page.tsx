"use client";

import { CompanionChat } from "@/components/companion/companion-chat";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/use-api";

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

export default function CompanionPage() {
  const { data: conversations, loading } = useApi<Conversation[]>("/api/conversations");
  const { data: session } = useApi<{ aiMode?: { id: string; label: string } }>("/api/auth/session");
  const { data: profile } = useApi<{ aiMemoryEnabled: boolean }>("/api/user/profile");

  if (loading || !conversations) return <PageSkeleton />;

  return (
    <CompanionChat
      initialConversations={conversations}
      aiMode={session?.aiMode ?? { id: "local", label: "AI" }}
      memoryEnabled={profile?.aiMemoryEnabled ?? true}
    />
  );
}
