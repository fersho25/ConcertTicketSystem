import { Component, OnInit } from '@angular/core';
import { ConciertoDTO, ConciertoService } from '../services/concierto.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  usuario: any = {};
  modoOscuroActivado = false;
  filtroBusqueda: string = '';
  conciertosFiltrados: ConciertoDTO[] = [];
  conciertos: ConciertoDTO[] = [];

  constructor(
    private conciertoService: ConciertoService,
    private router: Router,
    private translate: TranslateService,
    private currencyService: CurrencyService
  ) { }

  ngOnInit() {
    const data = localStorage.getItem('usuario');
    if (data) {
      this.usuario = JSON.parse(data);
    }
    this.cargarConciertos();
  }

  cambiarIdioma(lang: string) {
    this.translate.use(lang);
  }

  cambiarMoneda(moneda: 'CRC' | 'USD') {
    this.currencyService.setCurrency(moneda);
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
        this.conciertosFiltrados = [...this.conciertos];
      },
      (error) => {
        console.error('Error al cargar conciertos', error);
      }
    );
  }

  aplicarFiltro() {
    const filtro = this.filtroBusqueda.toLowerCase().trim();
    if (!filtro) {
      this.conciertosFiltrados = [...this.conciertos];
      return;
    }
    this.conciertosFiltrados = this.conciertos.filter(c =>
      c.nombre.toLowerCase().includes(filtro)
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
