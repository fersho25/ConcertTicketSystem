import { Component, OnInit } from '@angular/core';
import { ConciertoDTO, ConciertoService } from '../services/concierto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  usuario: any = {};
  modoOscuroActivado = false;

  conciertos: ConciertoDTO[] = [];

  constructor(private conciertoService: ConciertoService, private router: Router) { }

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    if (data) {
      this.usuario = JSON.parse(data);
    }

    this.cargarConciertos();
  }

  cerrarSesion() {
    const modoOscuro = localStorage.getItem('modoOscuro');
    localStorage.clear();
    if (modoOscuro !== null) {
      localStorage.setItem('modoOscuro', modoOscuro);
    }

    this.router.navigate(['/login'], { replaceUrl: true });
  }

  

  cargarConciertos() {
    this.conciertoService.obtenerConciertos().subscribe(
      (datos) => {
        this.conciertos = datos.map(c => ({
          ...c,
          archivosMultimedia: c.archivosMultimedia ?? []
        }));
      },
      (error) => {
        console.error('Error al cargar conciertos', error);
      }
    );
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
    }
    
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
