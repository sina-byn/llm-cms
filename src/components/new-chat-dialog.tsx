import { useRouter } from 'next/navigation';

import * as z from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

import { Plus } from 'lucide-react';

import { createConversation } from '@/server/chat';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';

const ConversationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  scope: z.string().min(1, 'Scope is required'),
});

export type Conversation = z.infer<typeof ConversationSchema> & {
  id?: string;
};

export function NewChatDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: { title: '', scope: '' },
    resolver: zodResolver(ConversationSchema),
  });

  const onSubmit = async (conversation: Conversation) => {
    const [conversationId, error] = await createConversation(conversation);

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    form.reset();
    toast.success('Chat created successfully');
    router.push(`?conversationId=${conversationId}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='mb-4 flex w-full items-center gap-2'
        >
          <Plus className='size-4' />
          <span>New Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              name='title'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Chat title...'
                      maxLength={255}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='scope'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scope</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a scope' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Scopes</SelectLabel>
                          <SelectItem value='shamin'>Shamin</SelectItem>
                          <SelectItem value='acadino'>Acadino</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
