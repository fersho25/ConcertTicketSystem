import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConciertoService, ConciertoDTO } from '../services/concierto.service';
import { ReservaService, ReservaDTO } from '../services/reserva.service';
import { CompraService, CompraDTO } from '../services/compra.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-estadisticas-concierto',
  templateUrl: './estadisticas-concierto.page.html',
  standalone: false,
  styleUrls: ['./estadisticas-concierto.page.scss'],
})
export class EstadisticasConciertoPage implements OnInit {

  conciertoId!: number;
  concierto!: ConciertoDTO;
  modoOscuroActivado = false;

  reservas: ReservaDTO[] = [];
  compras: CompraDTO[] = [];
  totalVentas: number = 0;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private conciertoService: ConciertoService,
    private reservaService: ReservaService,
    private compraService: CompraService
  ) { }

  ngOnInit() {
    this.conciertoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  cargarDatos() {
    this.conciertoService.obtenerConciertoPorId(this.conciertoId).subscribe(c => {
      this.concierto = c;
    });

    this.reservaService.obtenerReservas().subscribe(reservas => {
      this.reservas = reservas.filter(r => r.conciertoId === this.conciertoId);
    });

    this.compraService.getComprasPorConcierto(this.conciertoId).subscribe(compras => {
      this.compras = compras;
      this.totalVentas = this.compras.reduce((sum, c) => sum + c.precioTotal, 0);
    });
  }


  async volver() {
    this.navCtrl.back();
  }


  ionViewWillEnter() {

    const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
    this.modoOscuroActivado = modoOscuro;


    document.documentElement.classList.toggle('ion-palette-dark', modoOscuro);
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
