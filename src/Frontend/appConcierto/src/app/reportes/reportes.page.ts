import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../services/reportes.service';
import { ConciertoService, ConciertoDTO } from '../services/concierto.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, BaseChartDirective]
})
export class ReportesPage implements OnInit {

  conciertos: ConciertoDTO[] = [];
  selectedConcertId: number | null = null;

  // Propiedades para el gráfico
  public barChartData?: ChartData<'bar'>;
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '$' + value;
          }
        }
      }
    }
  };

  constructor(
    private reportesService: ReportesService,
    private conciertoService: ConciertoService
  ) { }

  ngOnInit() {
    this.conciertoService.obtenerConciertos().subscribe(data => {
      this.conciertos = data;
    });
  }

  generarReporte() {
    if (!this.selectedConcertId) return;

    // Lógica para descargar el archivo Excel
    this.reportesService.getSalesReport(this.selectedConcertId).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `reporte_concierto_${this.selectedConcertId}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });

    // Lógica para obtener y procesar los datos del gráfico
    this.reportesService.getSalesChartData(this.selectedConcertId).subscribe((salesData: any[]) => {
      this.procesarDatosParaGrafico(salesData);
    });
  }

  procesarDatosParaGrafico(data: any[]) {
    const labels: string[] = [];
    const revenues: number[] = [];
    const categoryMap = new Map<string, number>();

    // Agrupar y sumar los ingresos por categoría
    data.forEach(sale => {
      const currentRevenue = categoryMap.get(sale.categoriaAsiento) || 0;
      categoryMap.set(sale.categoriaAsiento, currentRevenue + sale.precio);
    });

    categoryMap.forEach((revenue, category) => {
      labels.push(category);
      revenues.push(revenue);
    });
    this.barChartData = {
      labels: labels,
      datasets: [
        {
          data: revenues,
          label: 'Ingresos Totales',
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };
  }
}
