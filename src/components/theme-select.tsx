import type { JSX } from 'react';

import { useTheme } from 'next-themes';

import { Sun, Moon, Monitor } from 'lucide-react';

const THEME_ICONS = {
  LIGHT: <Sun />,
  DARK: <Moon />,
  SYSTEM: <Monitor />,
};

import {
  Select,
  SelectItem,
  SelectGroup,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

export function ThemeSelect() {
  const { theme = 'system', setTheme } = useTheme();

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a theme...' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='system'>
            {THEME_ICONS.SYSTEM}
            System
          </SelectItem>
          <SelectItem value='dark'>
            {THEME_ICONS.DARK}
            Dark
          </SelectItem>
          <SelectItem value='light'>
            {THEME_ICONS.LIGHT}
            Light
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
