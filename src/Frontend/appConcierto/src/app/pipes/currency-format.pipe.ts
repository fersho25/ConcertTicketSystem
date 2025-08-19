import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { Observable, map } from 'rxjs';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {

  constructor(private currencyService: CurrencyService) { }

  transform(priceInCRC: number | undefined): string {
    if (priceInCRC === undefined) {
      return '';
    }
    return this.currencyService.convertAndFormat(priceInCRC);
  }
}
