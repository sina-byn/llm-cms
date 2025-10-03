import { getMessages } from '@/server/chat';

import { Chat } from '@/components/chat';

import type { UIMessage } from 'ai';

export default async function Home() {
  const messages = await getMessages('3da25b07-3fe3-4924-b849-052bc7fd1b1b');
  const UIMessages: UIMessage[] = messages.map(message => ({
    id: message.id,
    role: message.role,
    parts: [{ type: 'text', text: message.content }],
  }));

  return (
    <div>
      <Chat initialMessages={UIMessages} />
    </div>
  );
}
