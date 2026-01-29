import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  constructor(private i18nService: I18nService) {}

  transform(value: Date | string, format: 'short' | 'long' = 'long'): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    const lang = this.i18nService.getCurrentLanguage();
    const locale = lang === 'ar' ? 'ar-EG' : 'en-US';

    const options: Intl.DateTimeFormatOptions =
      format === 'long'
        ? { day: 'numeric', month: 'long', year: 'numeric' }
        : { day: 'numeric', month: 'short', year: 'numeric' };

    return new Intl.DateTimeFormat(locale, options).format(date);
  }
}
