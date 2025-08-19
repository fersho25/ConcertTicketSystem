import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {

  constructor(private currencyService: CurrencyService) { }

  transform(priceInCRC: number | undefined): Promise<string> {
    if (priceInCRC === undefined) {
      return Promise.resolve('');
    }
    return this.currencyService.convertAndFormat(priceInCRC);
  }
}
