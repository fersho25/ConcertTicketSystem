import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, IonicModule } from '@ionic/angular';
import { CompraService } from '../services/compra.service';
import { ReservaDTO } from '../services/reserva.service';
import { CompraDTO } from '../services/compra.service';
import { lastValueFrom, Subscription, interval } from 'rxjs';
import { ReservaService } from '../services/reserva.service';
import { ConciertoService } from '../services/concierto.service';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { QrModalComponent } from '../qr-modal/qr-modal.component';
import { Email, EmailService } from '../services/email.service';
import { useAnimation } from '@angular/animations';
import { AuthenticatorService, UsuarioDTO } from '../services/authenticator.service';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.page.html',
  styleUrls: ['./compra.page.scss'],
  standalone: false
})
export class CompraPage implements OnInit, OnDestroy {

  compraForm!: FormGroup;
  usuario!: UsuarioDTO;
  reserva!: ReservaDTO;
  precioTotal: number = 0;
  descuentoAplicado: number = 0;
  precioFinal: number = 0;
  modoOscuroActivado = false;
  private timerSubscription?: Subscription;
  reservaActualId: number | null = null;
  promociones: { nombre: string, descuento: number }[] = [];
  descuentosAplicados: { nombre: string, porcentaje: number }[] = [];
  categoriasConcierto: { id: number, nombre: string }[] = [];
  email!: Email;

  tiempoRestanteSegundos: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private compraService: CompraService,
    private reservaService: ReservaService,
    private conciertoService: ConciertoService,
    private modalCtrl: ModalController,
    private emailService: EmailService,
    private authenticatorService: AuthenticatorService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    const reservaGuardada = localStorage.getItem('reservaActual');
    if (reservaGuardada) {
      this.reserva = JSON.parse(reservaGuardada);
      this.reservaActualId = this.reserva?.id || null;
    }

    if (this.reserva && this.reserva.conciertoId) {
      this.conciertoService.obtenerConciertoPorId(this.reserva.conciertoId)
        .subscribe(concierto => {

          this.categoriasConcierto = concierto.categoriasAsiento.map(cat => ({
            id: cat.id,
            nombre: cat.nombre
          }));

          this.promociones = concierto.promociones
            .filter(p => p.activa)
            .map(p => ({ nombre: p.nombre, descuento: p.descuento }));

          if (this.promociones.length > 0) {
            this.compraForm.patchValue({ promocionAplicada: this.promociones[0].nombre });
          } else {
            this.compraForm.patchValue({ promocionAplicada: '' });
          }

          this.calcularPrecioTotal();
        });
    }

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

    this.descuentosAplicados = [];

    let descuentoPorVolumen = 0;
    if (cantidadAsientos >= 10) {
      descuentoPorVolumen = 30;
      this.descuentosAplicados.push({ nombre: 'Descuento por volumen', porcentaje: 30 });
    } else if (cantidadAsientos >= 8) {
      descuentoPorVolumen = 25;
      this.descuentosAplicados.push({ nombre: 'Descuento por volumen', porcentaje: 25 });
    } else if (cantidadAsientos >= 4) {
      descuentoPorVolumen = 10;
      this.descuentosAplicados.push({ nombre: 'Descuento por volumen', porcentaje: 10 });
    }

    if (this.promociones.length > 0) {
      const totalPorcentajePromociones = this.promociones.reduce((sum, p) => sum + p.descuento, 0);
      if (totalPorcentajePromociones > 0) {
        this.descuentosAplicados.push({ nombre: 'Suma de promociones activas', porcentaje: totalPorcentajePromociones });
      }
    }

    const totalPorcentaje = this.descuentosAplicados.reduce((sum, d) => sum + d.porcentaje, 0);
    this.descuentoAplicado = sumaAsientos * (totalPorcentaje / 100);

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
    this.reserva.estado = 'COMPRADA';


    const qrData = `
  Detalles del Tiquete Electrónico:
  ----------------------------------------------
  Reserva: ${this.reserva!.id}
  Método de pago: ${this.compraForm.value.metodoPago}
  Fecha y hora de compra: ${this.obtenerFechaHoraLegible(fechaCompra)}
  Precio total: ₡${this.precioTotal}
  Descuento aplicado: ${this.descuentoAplicado}%
  Precio final: ₡${this.precioFinal}
  Promoción: ${this.compraForm.value.promocionAplicada || 'Ninguna'}
  ----------------------------------------------
  ¡Gracias por su compra!
  `;



    const qrImagen = await QRCode.toDataURL(qrData);
    const qrSvg = await QRCode.toString(qrData, { type: 'svg' });


    const codigoUnico = uuidv4();
    let codigoQR = '';
    try {
      codigoQR = await QRCode.toDataURL(codigoUnico);
    } catch (err) {
      console.error('Error generando QR:', err);
    }

    const compraDto: CompraDTO = {
      id: 0,
      reservaId: this.reserva!.id,
      metodoPago: this.compraForm.value.metodoPago,
      fechaHoraCompra: fechaCompra,
      precioTotal: this.precioTotal,
      descuentoAplicado: this.descuentoAplicado,
      promocionAplicada: this.compraForm.value.promocionAplicada || '',
      codigoQR: qrImagen,
      notificado: false,
      estado: 'COMPRADA'
    };

    try {
      await lastValueFrom(this.compraService.registrarCompra(compraDto));

      const modal = await this.modalCtrl.create({
        component: QrModalComponent,
        componentProps: {
          precioFinal: this.precioFinal,
          codigoQR: qrImagen
        }
      });
      await modal.present();
      this.enviarCompra(qrSvg);
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

  enviarCompra(image: string) {
    const usuarioId = this.reserva.usuarioId;

    if (!usuarioId) {
      console.error('No se encontró el usuario de la reserva');
      return;
    }

    this.authenticatorService.obtenerUsuarioPorId(usuarioId).subscribe(
      async (usuario) => {
        this.usuario = usuario;

        const email: Email = {
          To: usuario.correoElectronico,
          Subject: 'Comprobante de compra',
          Body: `
          <h2>Comprobante de compra</h2>
          <p>Gracias por tu compra. Aquí está tu QR:</p>
          <div>${image}</div>
        `
        };

        this.emailService.EnviarCorreo(email).subscribe(
          async () => {
            const alert = await this.alertController.create({
              header: 'Éxito',
              message: `Tu comprobante fue enviado al correo: ${usuario.correoElectronico}`,
              buttons: ['Ok']
            });
            await alert.present();
          },
          async (error) => {
            console.error('Error al enviar el comprobante:', error);
          }
        );
      },
      (error) => console.error('Error al obtener usuario:', error)
    );
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

  private async eliminarReservaSiNoComprada() {
    if (this.reservaActualId && this.reserva?.estado !== 'COMPRADA') {
      try {
        await lastValueFrom(this.reservaService.eliminarReserva(this.reservaActualId));
      } catch (error) {
        console.warn('No se pudo eliminar la reserva:', error);
      }
    }
  }

  async limpiarYSalir() {
    await this.eliminarReservaSiNoComprada();
    this.limpiarCompra();
    this.router.navigate(['/home']);
  }

  obtenerNombreCategoria(id: number): string {
    const categoria = this.categoriasConcierto.find(c => c.id === id);
    return categoria ? categoria.nombre : 'Desconocida';
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
    this.limpiarYSalir();
    this.detenerTimer();
  }

  volverHome() {
    this.limpiarYSalir();
    this.router.navigate(['/home']);
  }

  async volverHomeConAlerta() {
    const alert = await this.alertController.create({
      header: 'Perderás la reserva',
      message: 'Si sales de esta página, perderás la reserva y volverás al inicio.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Salir',
          handler: () => {

            this.limpiarYSalir();
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
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
