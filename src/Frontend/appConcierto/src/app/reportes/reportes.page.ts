import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../services/reportes.service';
import { ConciertoService, ConciertoDTO } from '../services/concierto.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  standalone: true, // <-- AÑADE ESTA LÍNEA
  imports: [IonicModule, FormsModule, CommonModule] // <-- Y AÑADE ESTA LÍNEA
})

export class ReportesPage implements OnInit {

  // Corregido para usar el tipo de dato 'ConciertoDTO'
  conciertos: ConciertoDTO[] = [];
  selectedConcertId: number | null = null;

  constructor(
    private reportesService: ReportesService,
    // Corregido para inyectar la clase 'ConciertoService'
    private conciertoService: ConciertoService
  ) { }

  ngOnInit() {
    // Usamos el 'conciertoService' para llamar al método 'obtenerConciertos'
    this.conciertoService.obtenerConciertos().subscribe(data => {
      this.conciertos = data;
    });
  }

  generarReporte() {
    if (!this.selectedConcertId) {
      return;
    }

    this.reportesService.getSalesReport(this.selectedConcertId).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `reporte_concierto_${this.selectedConcertId}.xlsx`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}