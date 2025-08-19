import { CurrencyService } from '../services/currency.service';
import { CurrencyFormatPipe } from './currency-format.pipe';

describe('CurrencyFormatPipe', () => {
  it('create an instance', () => {
    const service = new CurrencyService();
    const pipe = new CurrencyFormatPipe(service);
    expect(pipe).toBeTruthy();
  });
});
