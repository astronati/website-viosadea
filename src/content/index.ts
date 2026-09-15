import type { Locale } from '../i18n/locales';
import type { PageCopy } from './types';
import it from './pages/it';
import en from './pages/en';
import de from './pages/de';
import pl from './pages/pl';
import ru from './pages/ru';

const COPY: Record<Locale, PageCopy> = { it, en, de, pl, ru };

export function getCopy(locale: Locale): PageCopy {
  return COPY[locale];
}

export type { PageCopy };
