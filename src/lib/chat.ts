import type { UIMessage } from 'ai';

export const stringifiyUIMessage = (
  message: Omit<UIMessage, 'id'> & { id?: string }
) => {
  return message.parts.reduce((acc, curr) => {
    if (curr.type === 'text') acc += curr.text;
    return acc;
  }, '');
};
