import { Component, OnInit } from '@angular/core';
import { CompraService, CompraDTO } from '../services/compra.service';
import { ConciertoService, ConciertoDTO } from '../services/concierto.service';
import { ReservaService, ReservaDTO } from '../services/reserva.service';

interface HistorialCompra {
  nombreConcierto: string;
  fecha: Date;
  asientos: string;
  precioTotal: number;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false
})
export class HistorialPage implements OnInit {

  historial: HistorialCompra[] = [];
  usuarioId: number = 0;

  constructor(
    private compraService: CompraService,
    private conciertoService: ConciertoService,
    private reservaService: ReservaService
  ) { }

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuarioObj = JSON.parse(usuarioGuardado);
      this.usuarioId = usuarioObj.id || usuarioObj.usuarioId || 0;
    }

    if (!this.usuarioId) return;

    const fechaCostaRica = (isoString: string): Date => {
      const date = new Date(isoString);
      date.setHours(date.getHours() - 6); 
      return date;
    };

    this.compraService.getComprasPorUsuario(this.usuarioId).subscribe({
      next: (compras: CompraDTO[]) => {
        this.conciertoService.obtenerConciertos().subscribe({
          next: (conciertos: ConciertoDTO[]) => {

            compras.forEach(compra => {
              if (!compra.reservaId) return;

              this.reservaService.obtenerReservaPorId(compra.reservaId).subscribe({
                next: (reserva: ReservaDTO) => {
                 
                  const asientosFiltrados = Array.from(new Set(reserva.asientos.map(a => a.numeroAsiento)));
                  const asientosStr = asientosFiltrados.map(num => `#${num}`).join(', ') || 'No especificados';

                  const concierto = conciertos.find(c => c.id === reserva.conciertoId);

                  this.historial.push({
                    nombreConcierto: concierto?.nombre || 'Concierto desconocido',
                    fecha: fechaCostaRica(reserva.fechaHoraReserva),
                    asientos: asientosStr,
                    precioTotal: compra.precioTotal
                  });

                  this.historial.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
                },
                error: err => console.error('Error al obtener reserva', err)
              });
            });

          },
          error: err => console.error('Error al obtener conciertos', err)
        });
      },
      error: err => console.error('Error al obtener compras', err)
    });
  }
}
