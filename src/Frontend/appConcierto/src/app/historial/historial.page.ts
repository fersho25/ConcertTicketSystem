import { Component, OnInit } from '@angular/core';
import { CompraService, CompraDTO } from '../services/compra.service';
import { ConciertoService, ConciertoDTO } from '../services/concierto.service';
import { ReservaService, ReservaDTO } from '../services/reserva.service';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

interface HistorialCompra {
  idCompra: number;
  nombreConcierto: string;
  fechaCompra: Date;
  fechaConcierto: Date;
  asientos: string;
  precioTotal: number;
  puedeCancelar: boolean;
  estadoCompra: 'Activa' | 'Finalizada';
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
  modoOscuroActivado = false;

  constructor(
    private compraService: CompraService,
    private conciertoService: ConciertoService,
    private reservaService: ReservaService,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute
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
                  if (!concierto) return;

                  const fechaConcierto = fechaCostaRica(concierto.fecha);
                  const fechaCompra = fechaCostaRica(reserva.fechaHoraReserva);

                  const ahora = new Date();
                  const diffHoras = (fechaConcierto.getTime() - ahora.getTime()) / (1000 * 60 * 60);
                  const puedeCancelar = diffHoras > 48;
                  const estadoCompra: 'Activa' | 'Finalizada' = fechaConcierto > ahora ? 'Activa' : 'Finalizada';

                  this.historial.push({
                    idCompra: compra.id,
                    nombreConcierto: concierto.nombre,
                    fechaCompra,
                    fechaConcierto,
                    asientos: asientosStr,
                    precioTotal: compra.precioTotal,
                    puedeCancelar,
                    estadoCompra
                  });

                  this.historial.sort((a, b) => b.fechaCompra.getTime() - a.fechaCompra.getTime());

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

  async confirmarCancelacion(idCompra: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar cancelación',
      message: '¿Estás seguro que quieres cancelar esta compra?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', handler: () => this.cancelarCompra(idCompra) }
      ]
    });
    await alert.present();
  }

  cancelarCompra(idCompra: number) {
    this.compraService.eliminarCompra(idCompra).subscribe({
      next: ok => {
        if (ok) {
          this.historial = this.historial.filter(h => h.idCompra !== idCompra);
          console.log(`Compra ${idCompra} eliminada correctamente.`);
        } else {
          console.error('No se pudo eliminar la compra.');
        }
      },
      error: err => console.error('Error al eliminar compra', err)
    });
  }

  volverHome() {
    this.router.navigate(['/home']);
  }

  ionViewWillEnter() {
    const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
    this.modoOscuroActivado = modoOscuro;
    document.documentElement.classList.toggle('ion-palette-dark', modoOscuro);
  }

  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
    localStorage.setItem('modoOscuro', JSON.stringify(shouldAdd));
    this.modoOscuroActivado = shouldAdd;
  }

  darkPaletteToggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }
}
