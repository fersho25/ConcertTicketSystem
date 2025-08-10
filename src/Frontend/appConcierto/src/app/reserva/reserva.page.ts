import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ReservaService, ReservaDTO, AsientoMapaDTO } from '../services/reserva.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
  standalone: false
})
export class ReservaPage implements OnInit {

  reservaForm!: FormGroup;
  modoOscuroActivado = false;
  asientosMapa: AsientoMapaDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.reservaForm = this.fb.group({
      usuarioId: [null, [Validators.required, Validators.min(1)]],
      conciertoId: [null, [Validators.required, Validators.min(1)]],
      fechaHoraReserva: ['', Validators.required],
      fechaHoraExpiracion: ['', Validators.required],
      estado: ['ACTIVA', Validators.required],
      metodoPago: ['', Validators.required],
      fechaHoraCompra: ['', Validators.required],
      precioTotal: [0, [Validators.required, Validators.min(0)]],
      descuentoAplicado: [0],  // solo para mostrar el descuento calculado
      promocionAplicada: [''], // lo dejamos vacío, no se usa
      codigoQR: [''],
      notificado: [false],
      asientos: this.fb.array([])
    });

    this.asientos.valueChanges.subscribe(() => {
      this.actualizarPrecioTotal();
    });

    this.cargarMapaAsientos();
  }

  get asientos(): FormArray {
    return this.reservaForm.get('asientos') as FormArray;
  }

  agregarAsiento(asiento: AsientoMapaDTO) {
    if (asiento.estado !== 'DISPONIBLE') return;

    const existe = this.asientos.controls.some(ctrl =>
      ctrl.value.numeroAsiento === asiento.numeroAsiento &&
      ctrl.value.categoriaAsientoId === asiento.categoriaAsientoId
    );
    if (existe) return;

    const asientoGroup = this.fb.group({
      CategoriaAsientoId: [asiento.categoriaAsientoId, [Validators.required, Validators.min(1)]],
      NumeroAsiento: [asiento.numeroAsiento, [Validators.required, Validators.min(1)]],
      Precio: [asiento.precio, [Validators.required, Validators.min(0)]]
    });

    this.asientos.push(asientoGroup);

    const index = this.asientosMapa.findIndex(a => a.numeroAsiento === asiento.numeroAsiento && a.categoriaAsientoId === asiento.categoriaAsientoId);
    if (index !== -1) {
      this.asientosMapa[index].estado = 'RESERVADO';
    }

    this.actualizarPrecioTotal();
  }

  eliminarAsiento(index: number) {
    this.asientos.removeAt(index);
    this.actualizarPrecioTotal();
  }

  private obtenerPorcentajeDescuento(cantidadAsientos: number): number {
  if (cantidadAsientos >= 10) return 30;
  if (cantidadAsientos >= 8) return 25;
  if (cantidadAsientos >= 4) return 10;
  return 0;
}

  private calcularDescuentoAutomatico(cantidadAsientos: number, totalSinDescuento: number): number {
  const porcentaje = this.obtenerPorcentajeDescuento(cantidadAsientos);
  return (totalSinDescuento * porcentaje) / 100;
}

  public actualizarPrecioTotal() {
  const asientos = this.asientos.value;
  const totalSinDescuento = asientos.reduce((sum: number, asiento: any) => sum + (asiento.Precio || 0), 0);

  // Descuento automático por volumen
  const porcentajeDescuento = this.obtenerPorcentajeDescuento(asientos.length);
  const descuentoAutomatico = this.calcularDescuentoAutomatico(asientos.length, totalSinDescuento);

  // Descuento por promoción aplicada (string)
  const promocionStr = this.reservaForm.get('promocionAplicada')?.value?.trim() || '';
  let descuentoPromo = 0;
  let promocionMostrar = '';

  if (promocionStr) {
    if (promocionStr.endsWith('%')) {
      const porcentaje = parseFloat(promocionStr.slice(0, -1));
      if (!isNaN(porcentaje) && porcentaje > 0) {
        descuentoPromo = (totalSinDescuento * porcentaje) / 100;
      }
    } else {
      const fijo = parseFloat(promocionStr);
      if (!isNaN(fijo) && fijo > 0) {
        descuentoPromo = fijo;
      }
    }
  }

  // Total final
  let total = totalSinDescuento - descuentoAutomatico - descuentoPromo;
  if (total < 0) total = 0;

  // Actualiza el formulario
  this.reservaForm.patchValue({
    precioTotal: total,
    descuentoAplicado: porcentajeDescuento,
     promocionAplicada: promocionMostrar
  }, { emitEvent: false });
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
      case 'VENDIDO': return 'red';
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
      async () => {
        const alert = await this.alertController.create({
          header: 'Reserva registrada',
          message: 'La reserva se ha registrado correctamente.',
          buttons: ['Ok']
        });
        await alert.present();
        this.reservaForm.reset();
        this.asientos.clear();
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
  }

  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
    localStorage.setItem('modoOscuro', JSON.stringify(shouldAdd));
    this.modoOscuroActivado = shouldAdd;
  }
}
