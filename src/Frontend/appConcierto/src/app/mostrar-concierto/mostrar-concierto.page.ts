import { Component, OnInit } from '@angular/core';
import { ConciertoDTO, ConciertoService } from '../services/concierto.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mostrar-concierto',
  standalone: false,
  templateUrl: './mostrar-concierto.page.html',
  styleUrls: ['./mostrar-concierto.page.scss'],
})
export class MostrarConciertoPage implements OnInit {

  concierto!: ConciertoDTO;
  modoOscuroActivado = false;

  constructor(
    private route: ActivatedRoute,
    private conciertoService: ConciertoService,
    private router: Router,
    private alertController : AlertController
  ) { }

  irAReserva(conciertoId: number) {
    localStorage.setItem('conciertoId', conciertoId.toString());
    this.router.navigate(['/reserva']); // aquí sin pasar parámetros
  }

  ngOnInit() {

    const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
    this.modoOscuroActivado = modoOscuro;
    document.documentElement.classList.toggle('ion-palette-dark', modoOscuro);

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.conciertoService.obtenerConciertoPorId(id).subscribe(concierto => {
      this.concierto = concierto;
    });
  }

  getSrcArchivo(archivo: any): string {
    return archivo.contenido.startsWith('data:')
      ? archivo.contenido
      : `data:${archivo.tipo};base64,${archivo.contenido}`;
  }


  activeIndex = 0;

  prevSlide() {
    if (this.activeIndex === 0) {
      this.activeIndex = this.concierto.archivosMultimedia.length - 1;
    } else {
      this.activeIndex--;
    }
  }

  nextSlide() {
    if (this.activeIndex === this.concierto.archivosMultimedia.length - 1) {
      this.activeIndex = 0;
    } else {
      this.activeIndex++;
    }
  }

  ionViewWillEnter() {
    // Esto se ejecuta cada vez que se entra a la vista
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.conciertoService.obtenerConciertoPorId(id).subscribe(concierto => {
      this.concierto = concierto;
      this.activeIndex = 0; // Reiniciar slider al entrar
    });
  }

   async mostrarAlerta(tipo: string) {
    let header = '';
    let message = '';

    switch (tipo) {
      case 'proximamente':
        header = 'Próximamente en Venta';
        message = 'Este concierto aún no está disponible para la venta.';
        break;

      case 'finalizado':
        header = 'Venta Terminada';
        message = 'Este concierto ya finalizó y no está disponible.';
        break;

      default:
        header = 'Aviso';
        message = 'Información no disponible.';
        break;
    }

    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
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
