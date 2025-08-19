import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  // Tasa de cambio fija para la demostración (Dólares a Colones)
  private exchangeRateUSD_CRC = 500;

  // Usamos un BehaviorSubject para que los componentes puedan "escuchar" los cambios de moneda
  private currentCurrency = new BehaviorSubject<'CRC' | 'USD'>('CRC');
  public currentCurrency$ = this.currentCurrency.asObservable();

  constructor() { }

  /**
   * Cambia la moneda activa en toda la aplicación.
   * @param currency La nueva moneda a establecer ('CRC' o 'USD').
   */
  setCurrency(currency: 'CRC' | 'USD') {
    this.currentCurrency.next(currency);
  }

  /**
   * Convierte un precio dado a la moneda actualmente seleccionada.
   * @param priceInCRC El precio original en Colones Costarricenses.
   * @returns El precio convertido y formateado como un string (ej: "₡25,000" o "$50.00").
   */
  convertAndFormat(priceInCRC: number): string {
    const currency = this.currentCurrency.getValue();

    if (currency === 'USD') {
      const priceInUSD = priceInCRC / this.exchangeRateUSD_CRC;
      // Formato para dólares
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceInUSD);
    } else {
      // Formato para colones
      return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(priceInCRC);
    }
  }
}
