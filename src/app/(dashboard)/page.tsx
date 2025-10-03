import { notFound } from 'next/navigation';

import {
  getConversationById,
  getConversations,
  getMessages,
} from '@/server/chat';

import { Chat } from '@/components/chat';

import type { UIMessage } from 'ai';

type HomeProps = {
  searchParams: Promise<
    Partial<{
      conversationId: string;
    }>
  >;
};

export default async function Home({ searchParams }: HomeProps) {
  const { conversationId = '' } = await searchParams;
  console.log(conversationId);

  const conversation = conversationId
    ? await getConversationById(conversationId)
    : null;

  const conversations = await getConversations();

  const messages = conversation ? await getMessages(conversationId) : [];

  const UIMessages: UIMessage[] = messages.map(message => ({
    id: message.id,
    role: message.role,
    parts: [{ type: 'text', text: message.content }],
  }));

  return (
    <div>
      <Chat
        initialMessages={UIMessages}
        conversation={conversation}
        conversations={conversations}
      />
    </div>
  );
}
