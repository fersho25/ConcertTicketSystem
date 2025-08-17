import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private baseUrl = 'https://localhost:7131/api/reports';

  constructor(private http: HttpClient) { }

  /**
   * Solicita el reporte de ventas de un concierto a la API.
   * @param concertId El ID del concierto.
   * @returns Un Blob con el contenido del archivo Excel.
   */
  getSalesReport(concertId: number) {
    // Construimos la URL final para el endpoint específico
    const url = `${this.baseUrl}/sales/${concertId}?format=excel`;

    return this.http.get(url, { responseType: 'blob' });
  }
}