import { Component, OnInit } from '@angular/core';
import { ConciertoDTO, ConciertoService, VentaDTO } from '../services/concierto.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule } from '@ionic/angular';
import { ReservaDTO } from '../services/reserva.service';
import { CompraDTO } from '../services/compra.service';

@Component({
  selector: 'app-panel-edicion',
  standalone: true,
  templateUrl: './panel-edicion.page.html',
  styleUrls: ['./panel-edicion.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule
  ]
})
export class PanelEdicionPage implements OnInit {

  usuario: any = {};
  modoOscuroActivado = false;
  reserva!: ReservaDTO;
  compra!: CompraDTO;

  conciertosUsuarios: ConciertoDTO[] = [];
  conciertos: ConciertoDTO[] = [];

  constructor(private conciertoService: ConciertoService, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    if (data) {
      this.usuario = JSON.parse(data);
      this.cargarSegunRol();
    }
  }

  cargarConciertos(usuarioID?: number) {
    const id = usuarioID ?? this.usuario?.id;

    if (!id) {
      console.error('No hay ID de usuario disponible para cargar conciertos');
      return;
    }

    this.conciertoService.getConciertosPorUsuario(id).subscribe({
      next: (conciertosUsuario) => {
        this.conciertosUsuarios = conciertosUsuario;
      },
      error: (error) => {
        console.error('Error cargando conciertos por usuario', error);
      }
    });
  }

  cargarTodosLosConciertos() {
    this.conciertoService.obtenerConciertos().subscribe({
      next: (data) => {
        this.conciertos = data;
      },
      error: (error) => {
        console.error("Error cargando todos los conciertos");
      }
    });

  }

  async EliminarConcierto(concierto: ConciertoDTO, reserva?: ReservaDTO, compra?: CompraDTO) {
    console.log("concierto.id", concierto.id);
    console.log("reserva", reserva);
    console.log("compra", compra);


    const alert = await this.alertController.create({
      header: `Confirmar eliminación de ${concierto.nombre}`,
      message: '¿Desea eliminar este concierto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.conciertoService.eliminarConcierto(concierto.id).subscribe({
              next: () => this.cargarTodosLosConciertos(),
              error: async () => {
                const alertErr = await this.alertController.create({
                  header: 'Error',
                  message: 'No se pudo eliminar el concierto ya que tiene alguna compra o reserva activa.',
                  buttons: ['OK']
                });
                await alertErr.present();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  

  cambiarEstadoVenta(concierto: ConciertoDTO) {
    this.conciertoService.toggleEstadoVenta(concierto.id).subscribe({
      next: (exito) => {
        if (exito) {
          concierto.venta!.estado = concierto.venta!.estado === 'Activo' ? 'Inactivo' : 'Activo';
        }
      }
    });
  }

  async ventaFinalizada(concierto: any) {
    const alert = await this.alertController.create({
      header: `${concierto.nombre}`,
      message: 'Este concierto termino su venta',
      buttons: ['Ok']
    });
    await alert.present();
  }

  esVentaHabilitable(venta: VentaDTO | undefined): boolean {
    if (!venta) return false;
    const fechaFin = new Date(venta.fechaFin);
    const ahora = new Date();
    return venta.estado === 'Inactivo' && fechaFin > ahora;
  }

  cargarSegunRol() {
    if (this.usuario.rol === 'promotor') {
      this.cargarConciertos();
    } else if (this.usuario.rol === 'administrador') {
      this.cargarTodosLosConciertos();
    }
  }





  getSrcArchivo(archivo: any): string {
    return `data:${archivo.tipo};base64,${archivo.contenido}`;
  }

  primerImagen(archivos: any[]): any | null {
    if (!archivos) return null;
    return archivos.find(a => a.tipo.startsWith('image/')) || null;
  }

  ionViewWillEnter() {

    const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
    this.modoOscuroActivado = modoOscuro;


    document.documentElement.classList.toggle('ion-palette-dark', modoOscuro);

    const data = localStorage.getItem('usuario');
    if (data) {
      this.usuario = JSON.parse(data);
      this.cargarSegunRol();
    }
  }

  darkPaletteToggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }

  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
    localStorage.setItem('modoOscuro', JSON.stringify(shouldAdd));
    this.modoOscuroActivado = shouldAdd;
  }
}
