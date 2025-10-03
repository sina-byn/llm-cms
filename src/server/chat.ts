'use server';

import { db } from '@/db';
import { messages } from '@/db/schema';

import { stringifiyUIMessage } from '@/lib/chat';

import { eq, type DrizzleError } from 'drizzle-orm';

import type { UIMessage } from 'ai';

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
