import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private baseUrl = 'https://localhost:7131/api/reports';

  constructor(private http: HttpClient) { }

  getSalesReport(concertId: number) {
    const url = `${this.baseUrl}/sales-file/${concertId}?format=excel`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getSalesChartData(concertId: number): Observable<any[]> {
    const url = `${this.baseUrl}/sales-chart-data/${concertId}`;
    return this.http.get<any[]>(url);
  }
}