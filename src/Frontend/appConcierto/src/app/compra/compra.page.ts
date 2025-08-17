import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CompraService } from '../services/compra.service';
import { ReservaDTO } from '../services/reserva.service';
import { CompraDTO } from '../services/compra.service';
import { lastValueFrom, Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.page.html',
  styleUrls: ['./compra.page.scss'],
  standalone: false
})
export class CompraPage implements OnInit, OnDestroy {

  compraForm!: FormGroup;
  reserva!: ReservaDTO;
  precioTotal: number = 0;
  descuentoAplicado: number = 0;
  precioFinal: number = 0;
  modoOscuroActivado = false;
  private timerSubscription?: Subscription;

  promociones: { [codigo: string]: number } = {
    'DESCUENTO10': 10,
    'PROMO5': 5
  };

  tiempoRestanteSegundos: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private compraService: CompraService
  ) { }

  ngOnInit() {
    // Cargar reserva guardada desde ReservaPage
    const reservaGuardada = localStorage.getItem('reservaActual');
    if (reservaGuardada) {
      this.reserva = JSON.parse(reservaGuardada);
    }

    // Leer fechas desde localStorage (misma que ReservaPage)
    const fechaReserva = localStorage.getItem('fechaHoraReserva')!;
    const fechaExpiracion = localStorage.getItem('fechaHoraExpiracion')!;

    this.compraForm = this.fb.group({
      metodoPago: ['', Validators.required],
      promocionAplicada: [''],
      descuentoAplicado: [0],
      estado: ['ACTIVA'],
      fechaHoraReserva: [fechaReserva, Validators.required],
      fechaHoraExpiracion: [fechaExpiracion, Validators.required],
      fechaHoraCompra: ['']
    });

    this.compraForm.get('promocionAplicada')?.valueChanges.subscribe(() => {
      this.calcularPrecioTotal();
    });

    this.calcularPrecioTotal();
    this.iniciarTimer();
  }

  ngOnDestroy() {
    this.detenerTimer();
  }

  calcularPrecioTotal() {
    if (!this.reserva?.asientos) return;

    const sumaAsientos = this.reserva.asientos.reduce((sum, a) => sum + a.precio, 0);
    const cantidadAsientos = this.reserva.asientos.length;

    let descuentoPorVolumen = 0;
    if (cantidadAsientos >= 10) descuentoPorVolumen = sumaAsientos * 0.3;
    else if (cantidadAsientos >= 8) descuentoPorVolumen = sumaAsientos * 0.25;
    else if (cantidadAsientos >= 4) descuentoPorVolumen = sumaAsientos * 0.1;

    const codigo = this.compraForm.get('promocionAplicada')?.value || '';
    const descuentoPromocion = this.promociones[codigo?.toUpperCase()]
      ? sumaAsientos * (this.promociones[codigo.toUpperCase()] / 100)
      : 0;

    this.descuentoAplicado = descuentoPorVolumen + descuentoPromocion;
    this.compraForm.patchValue({ descuentoAplicado: this.descuentoAplicado }, { emitEvent: false });
    this.precioTotal = sumaAsientos;
    this.precioFinal = sumaAsientos - this.descuentoAplicado;
  }

  limpiarCompra() {
    this.detenerTimer();
    localStorage.removeItem('reservaActual');
    localStorage.removeItem('fechaHoraReserva');
    localStorage.removeItem('fechaHoraExpiracion');
    localStorage.removeItem('conciertoId');
    localStorage.removeItem('fechaHoraCompra');
    localStorage.removeItem('estado');
    localStorage.removeItem('metodoPago');
    localStorage.removeItem('promocionAplicada');
    localStorage.removeItem('descuentoAplicado');
  }

  async confirmarCompra() {
    if (this.compraForm.invalid || this.compraForm.get('estado')?.value === 'VENCIDA') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: this.compraForm.get('estado')?.value === 'VENCIDA'
          ? 'La reserva ha expirado y no se puede comprar.'
          : 'Debe seleccionar un método de pago.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    if (!this.reserva) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay reserva seleccionada.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const fechaCompra = new Date().toISOString();
    this.compraForm.patchValue({ fechaHoraCompra: fechaCompra, estado: 'COMPRADA' });

    const compraDto: CompraDTO = {
      id: 0,
      reservaId: this.reserva!.id,
      metodoPago: this.compraForm.value.metodoPago,
      fechaHoraCompra: fechaCompra,
      precioTotal: this.precioTotal,
      descuentoAplicado: this.descuentoAplicado,
      promocionAplicada: this.compraForm.value.promocionAplicada || '',
      codigoQR: '',
      notificado: false,
      estado: 'COMPRADA'
    };

    try {
      await lastValueFrom(this.compraService.registrarCompra(compraDto));
      const alert = await this.alertController.create({
        header: 'Compra exitosa',
        message: `Su compra se ha completado correctamente. Total a pagar: ₡${this.precioFinal.toFixed(2)}`,
        buttons: ['Ok']
      });
      await alert.present();
      this.limpiarCompra();
      setTimeout(() => this.router.navigate(['/home']), 1500);
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: `No se pudo completar la compra: ${error.message || error}`,
        buttons: ['Ok']
      });
      await alert.present();
    }
  }

  private iniciarTimer() {
    this.detenerTimer();

    this.timerSubscription = interval(1000).subscribe(async () => {
      const ahora = new Date();
      const expiracionValue = this.compraForm.get('fechaHoraExpiracion')?.value;
      if (!expiracionValue) return;

      const expiracion = new Date(expiracionValue);
      this.actualizarEstadoCompra();

      if (ahora >= expiracion) {
        this.detenerTimer();
        const alert = await this.alertController.create({
          header: 'Tiempo expirado',
          message: 'El tiempo para completar la compra ha terminado.',
          buttons: [
            {
              text: 'Salir',
              role: 'cancel',
              handler: () => {
                this.limpiarCompra();
                this.router.navigate(['/home']);
              }
            },
          ],
          backdropDismiss: false
        });
        await alert.present();
      } else {
        const ahoraIso = ahora.toISOString();
        this.compraForm.patchValue({ fechaHoraReserva: ahoraIso }, { emitEvent: false });
        localStorage.setItem('fechaHoraReserva', ahoraIso);
        this.actualizarTiempoRestante();
      }
    });
  }

  private detenerTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  private actualizarTiempoRestante() {
    const expiracionValue = this.compraForm.get('fechaHoraExpiracion')?.value;
    if (!expiracionValue) return;
    const expiracion = new Date(expiracionValue);
    const ahora = new Date();
    const diffMs = expiracion.getTime() - ahora.getTime();
    this.tiempoRestanteSegundos = diffMs > 0 ? Math.floor(diffMs / 1000) : 0;
  }

  actualizarEstadoCompra() {
    const estadoActual = this.compraForm.get('estado')?.value;
    const expiracion = new Date(this.compraForm.get('fechaHoraExpiracion')?.value);
    const ahora = new Date();
    const fechaCompra = this.compraForm.get('fechaHoraCompra')?.value
      ? new Date(this.compraForm.get('fechaHoraCompra')?.value)
      : null;

    if (fechaCompra) {
      this.compraForm.patchValue({ estado: 'COMPRADA' }, { emitEvent: false });
    } else if (estadoActual === 'CANCELADA') {
      this.compraForm.patchValue({ estado: 'CANCELADA' }, { emitEvent: false });
    } else if (ahora >= expiracion) {
      this.compraForm.patchValue({ estado: 'VENCIDA' }, { emitEvent: false });
    } else {
      this.compraForm.patchValue({ estado: 'ACTIVA' }, { emitEvent: false });
    }
  }

  ionViewWillEnter() {
    const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
    this.modoOscuroActivado = modoOscuro;
    document.documentElement.classList.toggle('ion-palette-dark', modoOscuro);

    const fechaExpiracionGuardada = localStorage.getItem('fechaHoraExpiracion');
    const fechaReservaGuardada = localStorage.getItem('fechaHoraReserva');

    if (fechaExpiracionGuardada && fechaReservaGuardada) {
      this.compraForm.patchValue({
        fechaHoraExpiracion: fechaExpiracionGuardada,
        fechaHoraReserva: fechaReservaGuardada
      });
    }

    this.iniciarTimer();
  }

  ionViewWillLeave() {
    this.detenerTimer();
  }

  volverHome() {
    this.limpiarCompra();
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

  obtenerFechaHoraLegible(fechaIso: string): string {
    if (!fechaIso) return '';
    return new Date(fechaIso).toLocaleString();
  }

  get tiempoRestanteLegible(): string {
    const min = Math.floor(this.tiempoRestanteSegundos / 60);
    const seg = this.tiempoRestanteSegundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  }
}
