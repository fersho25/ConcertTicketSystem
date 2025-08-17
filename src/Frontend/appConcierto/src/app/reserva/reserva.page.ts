import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ReservaService, ReservaDTO, AsientoMapaDTO, AsientoReservaGetDTO } from '../services/reserva.service';
import { Subscription, interval } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

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
  tiempoRestanteSegundos: number = 0;
  asientosReservaGet: AsientoReservaGetDTO[] = [];


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
      if (indexMapa !== -1) this.asientosMapa[indexMapa].estado = 'DISPONIBLE';
    } else {
      if (asiento.estado !== 'DISPONIBLE') return;

      const asientoGroup = this.fb.group({
        CategoriaAsientoId: [asiento.categoriaAsientoId, [Validators.required, Validators.min(1)]],
        CategoriaNombre: [asiento.categoriaNombre],
        NumeroAsiento: [asiento.numeroAsiento, [Validators.required, Validators.min(1)]],
        Precio: [asiento.precio, [Validators.required, Validators.min(0)]]
      });

      this.asientos.push(asientoGroup);

      const indexMapa = this.asientosMapa.findIndex(a =>
        a.numeroAsiento === asiento.numeroAsiento && a.categoriaAsientoId === asiento.categoriaAsientoId);
      if (indexMapa !== -1) this.asientosMapa[indexMapa].estado = 'RESERVADO';
    }
  }

  eliminarAsiento(index: number) {
    const asiento = this.asientos.at(index).value;
    this.asientos.removeAt(index);

    const indexMapa = this.asientosMapa.findIndex(a =>
      a.numeroAsiento === asiento.NumeroAsiento && a.categoriaAsientoId === asiento.CategoriaAsientoId);
    if (indexMapa !== -1) this.asientosMapa[indexMapa].estado = 'DISPONIBLE';
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

      const diffMs = expiracion.getTime() - ahora.getTime();
      this.tiempoRestanteSegundos = diffMs > 0 ? Math.floor(diffMs / 1000) : 0;

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
                this.limpiarReserva();
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
        localStorage.setItem('fechaHoraReserva', ahora.toISOString());
      }
    });
  }

  limpiarReserva() {
    this.reservaForm.reset();
    this.asientos.clear();
    this.detenerTimer();
    localStorage.removeItem('fechaHoraExpiracion');
    localStorage.removeItem('fechaHoraReserva');
    localStorage.removeItem('reservaActual');
    localStorage.removeItem('conciertoId');
  }

  cargarAsientosPorReserva(reservaId: number) {
  this.reservaService.obtenerAsientosPorReserva(reservaId).subscribe({
    next: (asientos) => {
      this.asientosReservaGet = asientos;

      // Limpiar los asientos actuales
      this.asientos.clear();

      // Agregar al FormArray
      asientos.forEach(a => {
        this.asientos.push(this.fb.group({
          CategoriaAsientoId: [a.categoriaAsientoId],
          CategoriaNombre: [a.categoriaNombre],
          NumeroAsiento: [a.numeroAsiento],
          Precio: [a.precio],
          Estado: [a.estado]
        }));
      });

      // Actualizar el mapa de asientos
      this.asientosMapa.forEach(am => {
        const asientoEncontrado = asientos.find(ar =>
          ar.numeroAsiento === am.numeroAsiento && ar.categoriaAsientoId === am.categoriaAsientoId
        );
        if (asientoEncontrado) {
          am.estado = asientoEncontrado.estado;
        }
      });
    },
    error: async () => {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudieron cargar los asientos de la reserva.',
        buttons: ['Ok']
      });
      await alert.present();
    }
  });
}


  private detenerTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  private obtenerFechaHoraActual(): string {
    return new Date().toISOString();
  }

  private obtenerFechaHoraExpiracion(): string {
    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 3);
    return expiracion.toISOString();
  }

  obtenerFechaHoraLegible(fechaIso: string): string {
    if (!fechaIso) return '';
    return new Date(fechaIso).toLocaleString();
  }

  actualizarEstadoReserva() {
    const estadoActual = this.reservaForm.get('estado')?.value;
    const expiracion = new Date(this.reservaForm.get('fechaHoraExpiracion')?.value);
    const ahora = new Date();
    const fechaCompra = this.reservaForm.get('fechaHoraCompra')?.value ? new Date(this.reservaForm.get('fechaHoraCompra')?.value) : null;

    if (fechaCompra) {
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
      next: (data) => { this.asientosMapa = data; },
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

getColor(asiento: AsientoMapaDTO): string {
  switch (asiento.estado) {
    case 'DISPONIBLE': return 'green';
    case 'RESERVADO': 
      return this.reservaForm.get('estado')?.value === 'ACTIVA' ? 'yellow' : 'green';
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
        localStorage.setItem('reservaActual', JSON.stringify(reservaGuardada));
        this.detenerTimer();
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
  // Configuración del modo oscuro
  const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
  this.modoOscuroActivado = modoOscuro;
  document.documentElement.classList.toggle('ion-palette-dark', modoOscuro);

  // Recuperar reserva existente
  const reservaGuardada = localStorage.getItem('reservaActual');

  // Cargar mapa de asientos primero
  const conciertoId = this.reservaForm.get('conciertoId')?.value || 1;
  this.reservaService.obtenerMapaAsientos(conciertoId).subscribe({
    next: (data) => {
      // Aseguramos que los estados vienen del backend correctamente
      this.asientosMapa = data.map(a => ({
        ...a,
        estado: a.estado // DISPONIBLE, RESERVADO, COMPRADA
      }));

      if (reservaGuardada) {
        const reservaObj = JSON.parse(reservaGuardada);

        // Actualizar estado de la reserva
        this.reservaForm.patchValue({
          estado: reservaObj.estado || 'ACTIVA',
          fechaHoraReserva: reservaObj.fechaHoraReserva,
          fechaHoraExpiracion: reservaObj.fechaHoraExpiracion
        });

        // Cargar los asientos de la reserva en el form
        this.asientos.clear();
        reservaObj.asientos?.forEach((a: any) => {
          this.asientos.push(this.fb.group({
            CategoriaAsientoId: [a.CategoriaAsientoId, [Validators.required, Validators.min(1)]],
            NumeroAsiento: [a.NumeroAsiento, [Validators.required, Validators.min(1)]],
            Precio: [a.Precio, [Validators.required, Validators.min(0)]]
          }));

          // Actualizar el estado en el mapa
          const indexMapa = this.asientosMapa.findIndex(am =>
            am.numeroAsiento === a.NumeroAsiento && am.categoriaAsientoId === a.CategoriaAsientoId
          );
          if (indexMapa !== -1) {
            this.asientosMapa[indexMapa].estado = reservaObj.estado === 'COMPRADA' ? 'COMPRADA' : 'RESERVADO';
          }
        });
      }

      // Recuperar fechas guardadas si no hay reserva
      const fechaExpiracionGuardada = localStorage.getItem('fechaHoraExpiracion');
      const fechaReservaGuardada = localStorage.getItem('fechaHoraReserva');

      if (fechaExpiracionGuardada && fechaReservaGuardada) {
        this.reservaForm.patchValue({
          fechaHoraExpiracion: fechaExpiracionGuardada,
          fechaHoraReserva: fechaReservaGuardada
        });
      } else if (!reservaGuardada) {
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



  ionViewWillLeave() {
    this.detenerTimer();
    localStorage.removeItem('fechaHoraExpiracion');
    localStorage.removeItem('fechaHoraReserva');
  }

  volverHome() {
    this.limpiarReserva();
    this.router.navigate(['/home']);
  }

  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
    localStorage.setItem('modoOscuro', JSON.stringify(shouldAdd));
    this.modoOscuroActivado = shouldAdd;
  }

  darkPaletteToggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }

  get tiempoRestanteLegible(): string {
    const min = Math.floor(this.tiempoRestanteSegundos / 60);
    const seg = this.tiempoRestanteSegundos % 60;
    return `${min.toString().padStart(2,'0')}:${seg.toString().padStart(2,'0')}`;
  }

}
