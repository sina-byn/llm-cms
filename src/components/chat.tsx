'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

import { useChat, type UIMessage } from '@ai-sdk/react';

import { Eye, Square, ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';

import { CopyButton } from '@/components/copy-button';
import { SignOutButton } from '@/components/sign-out-button';

import { Button } from '@/components/ui/button';
import { ScrollButton } from '@/components/ui/scroll-button';

import {
  ChatContainerRoot,
  ChatContainerContent,
} from '@/components/ui/chat-container';

import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from '@/components/ui/prompt-input';

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from '@/components/ui/message';

import {
  Sidebar,
  SidebarMenu,
  SidebarInset,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarTrigger,
  SidebarProvider,
  SidebarGroupLabel,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { stringifiyUIMessage } from '@/lib/chat';
import { createMessage } from '@/server/chat';
import { toast } from 'sonner';
import { Conversation, NewChatDialog } from './new-chat-dialog';
import { Badge } from './ui/badge';

// Initial conversation history
const conversationHistory = [
  {
    period: 'Today',
    conversations: [
      {
        id: 't1',
        title: 'Project roadmap discussion',
        lastMessage:
          "Let's prioritize the authentication features for the next sprint.",
        timestamp: new Date().setHours(new Date().getHours() - 2),
      },
      {
        id: 't2',
        title: 'API Documentation Review',
        lastMessage:
          'The endpoint descriptions need more detail about rate limiting.',
        timestamp: new Date().setHours(new Date().getHours() - 5),
      },
      {
        id: 't3',
        title: 'Frontend Bug Analysis',
        lastMessage:
          'I found the issue - we need to handle the null state in the user profile component.',
        timestamp: new Date().setHours(new Date().getHours() - 8),
      },
    ],
  },
  {
    period: 'Yesterday',
    conversations: [
      {
        id: 'y1',
        title: 'Database Schema Design',
        lastMessage:
          "Let's add indexes to improve query performance on these tables.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
      {
        id: 'y2',
        title: 'Performance Optimization',
        lastMessage:
          'The lazy loading implementation reduced initial load time by 40%.',
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
    ],
  },
  {
    period: 'Last 7 days',
    conversations: [
      {
        id: 'w1',
        title: 'Authentication Flow',
        lastMessage: 'We should implement the OAuth2 flow with refresh tokens.',
        timestamp: new Date().setDate(new Date().getDate() - 3),
      },
      {
        id: 'w2',
        title: 'Component Library',
        lastMessage:
          'These new UI components follow the design system guidelines perfectly.',
        timestamp: new Date().setDate(new Date().getDate() - 5),
      },
      {
        id: 'w3',
        title: 'UI/UX Feedback',
        lastMessage:
          'The navigation redesign received positive feedback from the test group.',
        timestamp: new Date().setDate(new Date().getDate() - 6),
      },
    ],
  },
  {
    period: 'Last month',
    conversations: [
      {
        id: 'm1',
        title: 'Initial Project Setup',
        lastMessage:
          'All the development environments are now configured consistently.',
        timestamp: new Date().setDate(new Date().getDate() - 15),
      },
    ],
  },
];

type ChatSidebarProps = {
  conversations: Conversation[];
};

function ChatSidebar({ conversations }: ChatSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className='flex flex-row items-center justify-between gap-2 px-2 py-4'>
        <div className='flex flex-row items-center gap-2 px-2'>
          <div className='bg-primary/10 size-8 rounded-md'></div>
          <div className='text-md font-base font-medium text-primary tracking-tight'>
            Content Expert
          </div>
        </div>
        {/* <Button variant='ghost' className='size-8'>
          <Search className='size-4' />
        </Button> */}
      </SidebarHeader>
      <SidebarContent className='pt-4'>
        <div className='px-4'>
          <NewChatDialog />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarMenu>
            {conversations.map(conversation => (
              <SidebarMenuButton asChild key={conversation.id}>
                <Link href={`?conversationId=${conversation.id}`}>
                  <span>{conversation.title}</span>
                </Link>
              </SidebarMenuButton>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  );
}

type ChatContentProps = {
  conversation: Conversation;
  initialMessages: UIMessage[];
};

function ChatContent({ conversation, initialMessages }: ChatContentProps) {
  const { status, messages, sendMessage } = useChat({
    id: conversation.id,
    messages: initialMessages,

    onFinish: async ({ message }) => {
      const content = stringifiyUIMessage(message);

      await createMessage('3da25b07-3fe3-4924-b849-052bc7fd1b1b', {
        role: message.role,
        parts: [{ type: 'text', text: content }],
      });
    },

    onError: error => {
      console.error(error);
      toast.error(error.message);
    },
  });

  const [prompt, setPrompt] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isLoading = status !== 'ready';

  const handleSubmit = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setPrompt('');

    const error = await createMessage('3da25b07-3fe3-4924-b849-052bc7fd1b1b', {
      role: 'user',
      parts: [{ type: 'text', text: trimmedPrompt }],
    });

    if (error) {
      console.error(error);
      toast.error('Failed sending your message');
      return;
    }

    await sendMessage({ text: trimmedPrompt });
  };

  return (
    <main className='flex h-screen flex-col overflow-hidden'>
      <header className='bg-background z-10 flex h-16 w-full shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='flex items-center gap-x-2 text-foreground'>
          {conversation.title}
          <Badge className='capitalize'>{conversation.scope}</Badge>
        </div>
      </header>

      <div ref={chatContainerRef} className='relative flex-1 overflow-y-auto'>
        <ChatContainerRoot className='h-full'>
          <ChatContainerContent className='space-y-0 px-5 py-12'>
            {messages.map((message, index) => {
              const isAssistant = message.role === 'assistant';
              const isLastMessage = index === messages.length - 1;
              const content = stringifiyUIMessage(message);

              return (
                <Message
                  key={message.id}
                  className={cn(
                    'mx-auto flex w-full max-w-3xl flex-col gap-2 px-6',
                    isAssistant ? 'items-start' : 'items-end'
                  )}
                >
                  {isAssistant ? (
                    <div className='group flex w-full flex-col gap-0'>
                      <div dir='rtl' className='max-w-full w-fit'>
                        <MessageContent
                          markdown
                          className='prose dark:prose-invert flex-1 text-foreground font-vazirmatn rounded-lg bg-transparent p-0'
                        >
                          {content}
                        </MessageContent>
                      </div>
                      <MessageActions
                        className={cn(
                          '-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100',
                          isLastMessage && 'opacity-100'
                        )}
                      >
                        <MessageAction tooltip='Copy' delayDuration={100}>
                          <CopyButton text={content} />
                        </MessageAction>
                        <MessageAction tooltip='Preview' delayDuration={100}>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant='outline'>
                                <Eye />
                                Preview
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='grid grid-rows-[auto_1fr] max-h-[min(calc(100dvh_-_64px),_600px)] sm:max-w-[min(calc(100dvw_-_32px),_var(--container-3xl))]'>
                              <DialogHeader>
                                <DialogTitle>Content Preview</DialogTitle>
                              </DialogHeader>
                              <div className='overflow-y-auto overflow-x-hidden pr-4'>
                                <div dir='rtl'>
                                  <MessageContent
                                    markdown
                                    className='prose prose-ul:list-inside *:[&.not-prose]:!hidden dark:prose-invert max-w-full flex-1 text-foreground font-vazirmatn rounded-lg bg-transparent p-0'
                                  >
                                    {content}
                                  </MessageContent>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </MessageAction>
                        {/* <MessageAction tooltip='Upvote' delayDuration={100}>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='rounded-full'
                          >
                            <ThumbsUp />
                          </Button>
                        </MessageAction>
                        <MessageAction tooltip='Downvote' delayDuration={100}>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='rounded-full'
                          >
                            <ThumbsDown />
                          </Button>
                        </MessageAction> */}
                      </MessageActions>
                    </div>
                  ) : (
                    <div className='group flex flex-col items-end gap-1 w-full'>
                      <MessageContent className='w-fit text-primary max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]'>
                        {content}
                      </MessageContent>
                      <MessageActions
                        className={cn(
                          'flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100'
                        )}
                      >
                        {/* <MessageAction tooltip='Edit' delayDuration={100}>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='rounded-full'
                          >
                            <Pencil />
                          </Button>
                        </MessageAction>
                        <MessageAction tooltip='Delete' delayDuration={100}>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='rounded-full'
                          >
                            <Trash />
                          </Button>
                        </MessageAction> */}
                        <MessageAction tooltip='Copy' delayDuration={100}>
                          <CopyButton text={content} />
                        </MessageAction>
                      </MessageActions>
                    </div>
                  )}
                </Message>
              );
            })}
          </ChatContainerContent>
          <div className='absolute bottom-4 left-1/2 flex w-full max-w-3xl -translate-x-1/2 justify-end px-5'>
            <ScrollButton className='shadow-sm' />
          </div>
        </ChatContainerRoot>
      </div>

      <div className='bg-background z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5'>
        <div className='mx-auto max-w-3xl'>
          <PromptInput
            isLoading={isLoading}
            value={prompt}
            onValueChange={setPrompt}
            onSubmit={handleSubmit}
            className='border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs'
          >
            <div className='flex flex-col'>
              <PromptInputTextarea
                placeholder='Ask anything'
                className='min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base'
              />

              <PromptInputActions className='mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3'>
                <div className='flex items-center gap-2'>
                  {/* <PromptInputAction tooltip="Add a new action">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9 rounded-full"
                    >
                      <Plus size={18} />
                    </Button>
                  </PromptInputAction>

                  <PromptInputAction tooltip="Search">
                    <Button variant="outline" className="rounded-full">
                      <Globe size={18} />
                      Search
                    </Button>
                  </PromptInputAction>

                  <PromptInputAction tooltip="More actions">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9 rounded-full"
                    >
                      <MoreHorizontal size={18} />
                    </Button>
                  </PromptInputAction> */}
                </div>
                <div className='flex items-center gap-2'>
                  {/* <PromptInputAction tooltip="Voice input">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9 rounded-full"
                    >
                      <Mic size={18} />
                    </Button>
                  </PromptInputAction> */}

                  <Button
                    size='icon'
                    onClick={handleSubmit}
                    className='size-9 rounded-full'
                    disabled={!prompt.trim() || isLoading}
                  >
                    {!isLoading ? <ArrowUp size={18} /> : <Square size={18} />}
                  </Button>
                </div>
              </PromptInputActions>
            </div>
          </PromptInput>
        </div>
      </div>
    </main>
  );
}

type ChatProps = {
  conversation: Conversation | null;
  conversations: Conversation[];
  initialMessages: UIMessage[];
};

function Chat({ conversation, conversations, initialMessages }: ChatProps) {
  return (
    <SidebarProvider>
      <ChatSidebar conversations={conversations} />
      <SidebarInset>
        {conversation && (
          <ChatContent
            conversation={conversation}
            initialMessages={initialMessages}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}

export { Chat };
