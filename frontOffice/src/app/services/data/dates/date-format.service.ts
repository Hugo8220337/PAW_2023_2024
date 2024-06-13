import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  formatDate(dateFormat?: Date): string {
    if (!dateFormat) {
      return '';
    }
    return new Date(dateFormat).toISOString().substring(0, 10);
  }
}
