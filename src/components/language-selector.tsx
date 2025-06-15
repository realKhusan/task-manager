'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import Cookies from 'js-cookie';
import { Languages, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { LanguageConfig } from '@/types/language';

export const languages: LanguageConfig[] = [
  { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];


export default function LanguageToggle() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    startTransition(() => {
      Cookies.set('NEXT_LOCALE', value);
      window.location.reload();
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"lg"} variant="outline" className='rounded-full' disabled={isPending}>
          <Languages className="mr-2 h-4 w-4" />
          <span className="uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          {languages.map((loc) => (
            <DropdownMenuRadioItem key={loc.code} value={loc.code}>
              {loc.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}