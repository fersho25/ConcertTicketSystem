import { Component, OnInit } from '@angular/core';
import { ConciertoDTO, ConciertoService, VentaDTO } from '../services/concierto.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule } from '@ionic/angular';

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

  conciertos: ConciertoDTO[] = [];

  constructor(private conciertoService: ConciertoService, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    if (data) {
      this.usuario = JSON.parse(data);
      this.cargarConciertos(this.usuario.id);
    }
  }

  cargarConciertos(usuarioID?: number) {
    const id = usuarioID ?? this.usuario?.id;

    if (!id) {
      console.error('No hay ID de usuario disponible para cargar conciertos');
      return;
    }

    this.conciertoService.getConciertosPorUsuario(id).subscribe({
      next: (conciertos) => {
        this.conciertos = conciertos;
      },
      error: (error) => {
        console.error('Error cargando conciertos por usuario', error);
      }
    });
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

    this.cargarConciertos();
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
