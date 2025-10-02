import { useState } from 'react';

import { Copy, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

type CopyButtonProps = { text: string };

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);

        const timeout = setTimeout(() => {
          setCopied(false);
          clearTimeout(timeout);
        }, 500);
      })
      .catch(console.error);
  };

  return (
    <Button
      size='icon'
      variant='ghost'
      onClick={handleCopy}
      className='rounded-full cursor-pointer'
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}
