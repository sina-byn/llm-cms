'use server';

import { db } from '@/db';
import { conversations, messages } from '@/db/schema';

import { stringifiyUIMessage } from '@/lib/chat';

import { eq, type DrizzleError } from 'drizzle-orm';

import type { UIMessage } from 'ai';
import type { Conversation } from '@/components/new-chat-dialog';

export const createMessage = async (
  conversationId: string,
  message: Omit<UIMessage, 'id'>
) => {
  const { role } = message;
  const content = stringifiyUIMessage(message);

  try {
    await db.insert(messages).values({
      role,
      content,
      conversationId,
    });
  } catch (err) {
    console.error(err);
    return err as DrizzleError;
  }
};

export const getMessages = async (conversationId: string) => {
  return await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId));
};

export const createConversation = async (conversation: Conversation) => {
  const { title, scope } = conversation;

  try {
    const [newConversation] = await db
      .insert(conversations)
      .values({
        title,
        scope,
      })
      .returning({ id: conversations.id });

    return [newConversation.id!, null] as const;
  } catch (err) {
    console.error(err);
    return [null, err as DrizzleError] as const;
  }
};

export const getConversationById = async (conversationId: string) => {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId));

  return conversation;
};

export const getConversations = async () => {
  return await db.select().from(conversations);
};
