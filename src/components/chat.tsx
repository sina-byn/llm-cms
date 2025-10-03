'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

import { useChat, type UIMessage } from '@ai-sdk/react';

import { ArrowUp, Eye, PlusIcon, Square } from 'lucide-react';

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

// Initial chat messages
const initialMessages: UIMessage[] = [
  {
    id: '1',
    role: 'user',
    parts: [
      { type: 'text', text: 'Hello! Can you help me with a coding question?' },
    ],
  },
  {
    id: '2',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: "Of course! I'd be happy to help with your coding question. What would you like to know?",
      },
    ],
  },
  {
    id: '3',
    role: 'user',
    parts: [
      {
        type: 'text',
        text: 'How do I create a responsive layout with CSS Grid?',
      },
    ],
  },
  {
    id: '4',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: "Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
      },
    ],
  },
  {
    id: '5',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
      },
    ],
  },
  {
    id: '6',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: `
       
       
# استفاده از جمینی در خودکارسازی تولید پست‌های بلاگ

در دنیای پرسرعت امروز، تولید محتوا یکی از چالش‌های اصلی بلاگرها، بازاریابان و کسب‌وکارهای آنلاین است. تصور کنید که بتوانید با کمک هوش مصنوعی مانند **جمینی** (Gemini)، فرآیند نوشتن پست‌های بلاگ را به طور کامل خودکار کنید. **جمینی**، مدل پیشرفته هوش مصنوعی گوگل، نه تنها ایده‌های خلاقانه ارائه می‌دهد، بلکه می‌تواند محتوای کامل، بهینه‌شده و جذاب تولید کند. این ابزار بر پایه الگوریتم‌های یادگیری عمیق، **تولید محتوا** را از ساعات طولانی نوشتن به چند دقیقه کاهش می‌دهد. در این مقاله، به بررسی چگونگی **استفاده از جمینی در خودکارسازی تولید پست‌های بلاگ** می‌پردازیم. با تمرکز بر **ابزارهای هوش مصنوعی** و **بهره‌وری نوشتاری**، خواهید دید چگونه این فناوری می‌تواند به شما کمک کند تا محتوای باکیفیتی برای مخاطبان فارسی‌زبان ایجاد کنید، بدون اینکه از اصالت فرهنگی غافل شوید. همان‌طور که ضرب‌المثل پارسی می‌گوید: «کار نیکو کردن از پر کردن است» – با جمینی، پر کردن صفحات بلاگ آسان‌تر از همیشه است!

## مقدمه‌ای بر جمینی: ابزاری قدرتمند برای تولید محتوا

**جمینی**، به عنوان یکی از جدیدترین **ابزارهای هوش مصنوعی**، بر خلاف مدل‌های قبلی، قابلیت‌های چندرسانه‌ای و درک زبانی عمیق‌تری دارد. این هوش مصنوعی می‌تواند بر اساس موضوع، کلمات کلیدی و حتی لحن مورد نظر، پست‌های بلاگ کامل تولید کند. برای مثال، اگر بخواهید در مورد تاریخ ایران بنویسید، جمینی نه تنها متن را می‌نویسد، بلکه جزئیات فرهنگی را هم در نظر می‌گیرد.

در **خودکارسازی تولید پست‌های بلاگ**، جمینی مانند یک دستیار هوشمند عمل می‌کند. شما فقط ورودی‌هایی مانند موضوع («فواید چای ایرانی») و کلمات کلیدی («چای، فرهنگ ایرانی، سلامت») را وارد می‌کنید، و خروجی یک مقاله ساختارمند و جذاب است. این فرآیند، زمان را از ۵-۱۰ ساعت به کمتر از ۳۰ دقیقه کاهش می‌دهد، که برای بلاگرهای پرمشغله ایده‌آل است. اما نکته کلیدی، ویرایش انسانی است تا محتوای نهایی با صدای منحصربه‌فرد شما همخوانی داشته باشد.

## مزایای استفاده از جمینی در بهره‌وری نوشتاری

استفاده از **جمینی** در **تولید محتوا** مزایای متعددی دارد که مستقیماً به **بهره‌وری نوشتاری** مربوط می‌شود. اولاً، این ابزار می‌تواند ایده‌های اولیه را به سرعت تولید کند. مثلاً، با پرسش‌هایی مانند «یک طرح کلی برای پست بلاگ در مورد سفر به اصفهان بنویس»، جمینی لیستی از بخش‌ها، عناوین فرعی و نکات کلیدی ارائه می‌دهد.

- **صرفه‌جویی در زمان**: به جای تحقیق طولانی، جمینی اطلاعات معتبر را از منابع به‌روز استخراج می‌کند.
- **بهینه‌سازی SEO**: کلمات کلیدی را به طور طبیعی وارد متن می‌کند، که برای رتبه‌بندی در موتورهای جستجو مانند گوگل حیاتی است.
- **تنوع زبانی**: برای مخاطبان فارسی‌زبان، جمینی می‌تواند متنی رسمی یا محاوره‌ای تولید کند، با رعایت قواعد دستوری و اصطلاحات فرهنگی.

در تجربه‌های عملی، کاربران گزارش داده‌اند که با **جمینی**، کیفیت پست‌های بلاگ‌شان ۴۰% افزایش یافته، در حالی که خستگی نوشتاری کاهش پیدا کرده است. این ابزار، مانند یک همکار وفادار، خلاقیت شما را تقویت می‌کند نه اینکه جایگزین آن شود.

## چالش‌ها و نکات عملی در خودکارسازی با جمینی

هرچند **جمینی** انقلابی در **خودکارسازی تولید پست‌های بلاگ** ایجاد کرده، اما چالش‌هایی هم وجود دارد. یکی از مسائل اصلی، حفظ اصالت محتوا است. هوش مصنوعی ممکن است گاهی محتوای کلیشه‌ای تولید کند، بنابراین ویرایش ضروری است. علاوه بر این، مسائل حقوقی مانند کپی‌رایت را باید در نظر گرفت؛ همیشه محتوای تولیدی را با منابع معتبر چک کنید.

برای استفاده بهینه:
1. **ورودی دقیق بدهید**: موضوع، کلمات کلیدی و لحن را مشخص کنید. مثلاً: «پست بلاگ در مورد آشپزی ایرانی با تمرکز بر کلمات: غذای سنتی، مواد طبیعی، سلامتی.»
2. **ویرایش فرهنگی**: محتوای تولیدشده را با عناصر پارسی مانند شعر سعدی یا ضرب‌المثل‌ها غنی کنید تا برای مخاطبان ایرانی جذاب‌تر شود.
3. **ترکیب با ابزارهای دیگر**: جمینی را با ویرایشگرهایی مانند Grammarly یا نرم‌افزارهای فارسی مانند ویراستیار ترکیب کنید.

با رعایت این نکات، **ابزارهای هوش مصنوعی** مانند جمینی می‌توانند به بلاگرهای ایرانی کمک کنند تا در بازار رقابتی محتوا، پیشتاز باشند. مثلاً، یک بلاگر غذا می‌تواند پست‌هایی در مورد «کوکو سبزی» تولید کند که هم اطلاع‌رسان و هم سرگرم‌کننده باشد.

## کاربردهای پیشرفته جمینی در تولید محتوای فرهنگی

**جمینی** نه تنها برای پست‌های عمومی، بلکه برای محتوای فرهنگی هم عالی است. در زمینه پارسی، می‌توانید از آن برای تولید پست‌هایی در مورد ادبیات، تاریخ یا سنت‌ها استفاده کنید. برای نمونه، درخواست «نوشتن مقاله‌ای در مورد نوروز با کلمات کلیدی: جشن باستانی، خانواده، تجدید» نتیجه‌ای غنی و الهام‌بخش خواهد داد.

این ابزار به **بهره‌وری نوشتاری** در سطح فرهنگی کمک می‌کند، جایی که حفظ هویت ایرانی مهم است. جمینی می‌تواند ارجاعاتی به شاهکارهایی مانند مثنوی مولانا بگنجاند، و شما را از تحقیق صفر می‌کند. در نهایت، این فناوری به بلاگرها اجازه می‌دهد تا بر جنبه‌های خلاقانه تمرکز کنند، مانند افزودن تصاویر شخصی یا داستان‌های واقعی.

## نتیجه‌گیری

در خلاصه، **استفاده از جمینی در خودکارسازی تولید پست‌های بلاگ** انقلابی در دنیای محتوا ایجاد کرده است. با مزایایی مانند صرفه‌جویی در زمان، بهینه‌سازی SEO و تقویت **بهره‌وری نوشتاری**، این **ابزار هوش مصنوعی** به بلاگرهای فارسی‌زبان کمک می‌کند تا محتوای باکیفیت و فرهنگی تولید کنند. همان‌طور که دیدیم، از ایده‌پردازی تا ویرایش، جمینی دستیاری قدرتمند است، اما موفقیت در ترکیب آن با خلاقیت انسانی نهفته. اگر به دنبال افزایش کارایی بلاگ خود هستید، همین حالا جمینی را امتحان کنید! آیا شما تجربه‌ای از استفاده از ابزارهای هوش مصنوعی در نوشتن دارید؟ تجربیات‌تان را در بخش نظرات به اشتراک بگذارید و بگویید چطور **تولید محتوا** را خودکار کرده‌اید. منتظر شنیدن داستان‌های شما هستیم!`,
      },
    ],
  },
];

function ChatSidebar() {
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
          <Button
            variant='outline'
            className='mb-4 flex w-full items-center gap-2'
          >
            <PlusIcon className='size-4' />
            <span>New Chat</span>
          </Button>
        </div>
        {conversationHistory.map(group => (
          <SidebarGroup key={group.period}>
            <SidebarGroupLabel>{group.period}</SidebarGroupLabel>
            <SidebarMenu>
              {group.conversations.map(conversation => (
                <SidebarMenuButton asChild key={conversation.id}>
                  <Link href='#'>
                    <span>{conversation.title}</span>
                  </Link>
                </SidebarMenuButton>
              ))}
              {group.conversations.map(conversation => (
                <SidebarMenuButton asChild key={conversation.id}>
                  <Link href='#'>
                    <span>{conversation.title}</span>
                  </Link>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  );
}

type ChatContentProps = { initialMessages: UIMessage[] };

function ChatContent({ initialMessages }: ChatContentProps) {
  const { status, messages, sendMessage } = useChat({
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
        <div className='text-foreground'>Project roadmap discussion</div>
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

type ChatProps = { initialMessages: UIMessage[] };

function Chat({ initialMessages }: ChatProps) {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset>
        <ChatContent initialMessages={initialMessages} />
      </SidebarInset>
    </SidebarProvider>
  );
}

export { Chat };
