import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiModeLabel } from "@/lib/ai";
import { CompanionChat } from "@/components/companion/companion-chat";

export const metadata = { title: "Teman AI" };

export default async function CompanionPage() {
  const user = (await getCurrentUser())!;
  const conversations = await db.conversation.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 30,
    select: { id: true, title: true, updatedAt: true },
  });

  return (
    <CompanionChat
      initialConversations={conversations.map((c) => ({
        id: c.id,
        title: c.title,
        updatedAt: c.updatedAt.toISOString(),
      }))}
      aiMode={aiModeLabel()}
      memoryEnabled={user.aiMemoryEnabled}
    />
  );
}
