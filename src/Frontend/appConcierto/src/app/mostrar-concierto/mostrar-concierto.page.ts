import { Component, OnInit } from '@angular/core';
import { ConciertoDTO, ConciertoService } from '../services/concierto.service';
import { ActivatedRoute } from '@angular/router';

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
    private conciertoService: ConciertoService
  ) { }

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
  if(this.activeIndex === 0) {
    this.activeIndex = this.concierto.archivosMultimedia.length - 1;
  } else {
    this.activeIndex--;
  }
}

nextSlide() {
  if(this.activeIndex === this.concierto.archivosMultimedia.length - 1) {
    this.activeIndex = 0;
  } else {
    this.activeIndex++;
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
