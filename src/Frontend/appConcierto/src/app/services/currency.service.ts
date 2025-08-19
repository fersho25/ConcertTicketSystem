import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currentCurrency = new BehaviorSubject<'CRC' | 'USD'>('USD');
  public currentCurrency$ = this.currentCurrency.asObservable();
  private apiUrl = 'https://api.exchangerate.host';

  constructor(private http: HttpClient) {
    this.detectCurrencyByLocation();
  }

  private async detectCurrencyByLocation() {
    try {
      const data = await firstValueFrom(this.http.get<any>('https://ipwho.is/'));
      console.log('IP who.is response:', data);
      const currencyCode = data?.currency?.code;

      if (currencyCode === 'CRC') {
        this.setCurrency('CRC');
      } else if (currencyCode === 'USD') {
        this.setCurrency('USD');
      } else {
        console.warn('Currency not detected, defaulting to USD');
        this.setCurrency('USD'); // default
      }
    } catch (err) {
      console.error('Error detecting currency:', err);
      this.setCurrency('USD');
    }
  }


  setCurrency(currency: 'CRC' | 'USD', override = false) {
  if (override) {
    this.currentCurrency.next(currency);
  } else {
    // solo establece automáticamente si no se ha hecho override
    if (!localStorage.getItem('currencyOverride')) {
      this.currentCurrency.next(currency);
    }
  }
}


  async convertAndFormat(priceInCRC: number): Promise<string> {
    const currency = this.currentCurrency.getValue();

    if (currency === 'USD') {
      const url = `${this.apiUrl}/convert?from=CRC&to=USD&amount=${priceInCRC}`;
      const data = await firstValueFrom(this.http.get<any>(url));
      const result = data?.result ?? priceInCRC;
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result);
    } else {
      return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(priceInCRC);
    }
  }
}
