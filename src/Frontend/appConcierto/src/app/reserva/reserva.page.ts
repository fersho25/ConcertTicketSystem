import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ReservaService, ReservaDTO, AsientoMapaDTO } from '../services/reserva.service';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
  standalone: false,
})
export class ReservaPage implements OnInit, OnDestroy {

  reservaForm!: FormGroup;
  modoOscuroActivado = false;
  asientosMapa: AsientoMapaDTO[] = [];

  private timerSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    const usuarioGuardado = localStorage.getItem('usuario');
    let usuarioId = 0;

    if (usuarioGuardado) {
      const usuarioObj = JSON.parse(usuarioGuardado);

      usuarioId = usuarioObj.id || usuarioObj.usuarioId || 0;
    }

    const conciertoIdGuardado = localStorage.getItem('conciertoId');
    const conciertoId = conciertoIdGuardado ? +conciertoIdGuardado : null;



    this.reservaForm = this.fb.group({
      usuarioId: [usuarioId, [Validators.required, Validators.min(1)]],
      conciertoId: [conciertoId, [Validators.required, Validators.min(1)]],
      fechaHoraReserva: [this.obtenerFechaHoraActual(), Validators.required],
      fechaHoraExpiracion: [this.obtenerFechaHoraExpiracion(), Validators.required],
      estado: ['ACTIVA', Validators.required],
      asientos: this.fb.array([])
    });

    this.actualizarEstadoReserva();

    this.iniciarTimer();

    

    this.cargarMapaAsientos();
  }

  get asientos(): FormArray {
    return this.reservaForm.get('asientos') as FormArray;
  }

  agregarAsiento(asiento: AsientoMapaDTO) {

    const asientoIndex = this.asientos.controls.findIndex(ctrl =>
      ctrl.value.NumeroAsiento === asiento.numeroAsiento &&
      ctrl.value.CategoriaAsientoId === asiento.categoriaAsientoId
    );

    if (asientoIndex !== -1) {

      this.asientos.removeAt(asientoIndex);

      const indexMapa = this.asientosMapa.findIndex(a =>
        a.numeroAsiento === asiento.numeroAsiento && a.categoriaAsientoId === asiento.categoriaAsientoId);
      if (indexMapa !== -1) {
        this.asientosMapa[indexMapa].estado = 'DISPONIBLE';
      }
    } else {

      if (asiento.estado !== 'DISPONIBLE') return;

      const asientoGroup = this.fb.group({
        CategoriaAsientoId: [asiento.categoriaAsientoId, [Validators.required, Validators.min(1)]],
        NumeroAsiento: [asiento.numeroAsiento, [Validators.required, Validators.min(1)]],
        Precio: [asiento.precio, [Validators.required, Validators.min(0)]]
      });

      this.asientos.push(asientoGroup);

      const indexMapa = this.asientosMapa.findIndex(a =>
        a.numeroAsiento === asiento.numeroAsiento && a.categoriaAsientoId === asiento.categoriaAsientoId);
      if (indexMapa !== -1) {
        this.asientosMapa[indexMapa].estado = 'RESERVADO';
      }
    }

  
  }

  eliminarAsiento(index: number) {

    const asiento = this.asientos.at(index).value;

    this.asientos.removeAt(index);

    const indexMapa = this.asientosMapa.findIndex(a =>
      a.numeroAsiento === asiento.NumeroAsiento && a.categoriaAsientoId === asiento.CategoriaAsientoId);
    if (indexMapa !== -1) {
      this.asientosMapa[indexMapa].estado = 'DISPONIBLE';
    }

  
  }


  ngOnDestroy() {
    this.detenerTimer();
  }

  private iniciarTimer() {
    this.detenerTimer();

    if (!localStorage.getItem('fechaHoraExpiracion')) {
      localStorage.setItem('fechaHoraExpiracion', this.reservaForm.get('fechaHoraExpiracion')?.value);
    }
    if (!localStorage.getItem('fechaHoraReserva')) {
      localStorage.setItem('fechaHoraReserva', this.reservaForm.get('fechaHoraReserva')?.value);
    }

    this.timerSubscription = interval(1000).subscribe(async () => {
      const ahora = new Date();
      const expiracionValue = this.reservaForm.get('fechaHoraExpiracion')?.value;
      if (!expiracionValue) return;

      const expiracion = new Date(expiracionValue);

      this.actualizarEstadoReserva();

      if (ahora >= expiracion) {
        this.detenerTimer();
        const alert = await this.alertController.create({
          header: 'Tiempo expirado',
          message: 'El tiempo para completar la reserva ha terminado.',
          buttons: [
            {
              text: 'Salir',
              role: 'cancel',
              handler: () => {
                this.reservaForm.reset();
                this.asientos.clear();
                this.router.navigate(['/home']);
              }
            },
          ],
          backdropDismiss: false
        });

        await alert.present();
      } else {
        this.reservaForm.patchValue({
          fechaHoraReserva: ahora.toISOString()
        }, { emitEvent: false });
      }
    });
  }

  limpiarReserva() {
    this.reservaForm.reset();
    this.asientos.clear();
    this.detenerTimer();
    localStorage.removeItem('fechaHoraExpiracion');
    localStorage.removeItem('fechaHoraReserva');
    localStorage.removeItem('idConcierto');
  }

  private detenerTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  private obtenerFechaHoraActual(): string {
    const ahora = new Date();
    return ahora.toISOString(); // formato ISO: "2025-08-11T23:59:59.000Z"
  }

  private obtenerFechaHoraExpiracion(): string {
    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 3);
    return expiracion.toISOString();
  }

  public obtenerFechaHoraLegible(fechaIso: string): string {
    if (!fechaIso) return '';
    const fecha = new Date(fechaIso);
    return fecha.toLocaleString();
  }

  public tiempoRestanteSegundos(): number {
    const expiracionValue = this.reservaForm.get('fechaHoraExpiracion')?.value;
    if (!expiracionValue) return 0;
    const expiracion = new Date(expiracionValue);
    const ahora = new Date();
    const diffMs = expiracion.getTime() - ahora.getTime();
    return diffMs > 0 ? Math.floor(diffMs / 1000) : 0;
  }

  actualizarEstadoReserva() {
  const estadoActual = this.reservaForm.get('estado')?.value;
  const expiracion = new Date(this.reservaForm.get('fechaHoraExpiracion')?.value);
  const ahora = new Date();
  const fechaCompra = this.reservaForm.get('fechaHoraCompra')?.value ? new Date(this.reservaForm.get('fechaHoraCompra')?.value) : null;

  if (fechaCompra) {
    // Ya fue comprada
    this.reservaForm.patchValue({ estado: 'COMPRADA' }, { emitEvent: false });
  } else if (estadoActual === 'CANCELADA') {
    
    this.reservaForm.patchValue({ estado: 'CANCELADA' }, { emitEvent: false });
  } else if (ahora >= expiracion) {
    
    this.reservaForm.patchValue({ estado: 'VENCIDA' }, { emitEvent: false });
  } else {
    
    this.reservaForm.patchValue({ estado: 'ACTIVA' }, { emitEvent: false });
  }
}




  cargarMapaAsientos() {
    const conciertoId = this.reservaForm.get('conciertoId')?.value || 1;

    this.reservaService.obtenerMapaAsientos(conciertoId).subscribe({
      next: (data) => {
        this.asientosMapa = data;
      },
      error: async () => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo cargar el mapa de asientos.',
          buttons: ['Ok']
        });
        await alert.present();
      }
    });
  }

  getColor(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'green';
      case 'RESERVADO': return 'yellow';
      case 'COMPRADA': return 'red';
      default: return 'gray';
    }
  }

  async registrarReserva() {
  if (this.reservaForm.invalid) {
    const alert = await this.alertController.create({
      header: 'Formulario inválido',
      message: 'Por favor, complete todos los campos correctamente.',
      buttons: ['Ok']
    });
    await alert.present();
    return;
  }

  const reserva: ReservaDTO = this.reservaForm.value;

  this.reservaService.registrarReserva(reserva).subscribe(
    async (reservaGuardada) => {
      // Guardamos la reserva en localStorage para usarla en compra
      localStorage.setItem('reservaActual', JSON.stringify(reservaGuardada));
      this.detenerTimer();

      // Vamos directo a compra
      this.router.navigate(['/compra']);
    },
    async () => {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo registrar la reserva.',
        buttons: ['Ok']
      });
      await alert.present();
    }
  );
}




  ionViewWillEnter() {
    const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
    this.modoOscuroActivado = modoOscuro;
    document.documentElement.classList.toggle('ion-palette-dark', modoOscuro);

    const fechaExpiracionGuardada = localStorage.getItem('fechaHoraExpiracion');
    const fechaReservaGuardada = localStorage.getItem('fechaHoraReserva');

    if (fechaExpiracionGuardada && fechaReservaGuardada) {
      this.reservaForm.patchValue({
        fechaHoraExpiracion: fechaExpiracionGuardada,
        fechaHoraReserva: fechaReservaGuardada
      });
    } else {
      const ahora = new Date();
      const expiracion = new Date();
      expiracion.setMinutes(ahora.getMinutes() + 3);
      this.reservaForm.patchValue({
        fechaHoraReserva: ahora.toISOString(),
        fechaHoraExpiracion: expiracion.toISOString()
      });
      localStorage.setItem('fechaHoraExpiracion', expiracion.toISOString());
      localStorage.setItem('fechaHoraReserva', ahora.toISOString());
    }

    this.iniciarTimer();

  }

  volverHome() {
    this.limpiarReserva();
    this.router.navigate(['/home']);
  }

  ionViewWillLeave() {
    this.detenerTimer();

    localStorage.removeItem('fechaHoraExpiracion');
    localStorage.removeItem('fechaHoraReserva');
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
