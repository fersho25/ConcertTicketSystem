import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CompraService } from '../services/compra.service';
import { ReservaDTO } from '../services/reserva.service';
import { CompraDTO } from '../services/compra.service'; 
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.page.html',
  styleUrls: ['./compra.page.scss'],
  standalone: false
})
export class CompraPage implements OnInit {

  compraForm!: FormGroup;
  reserva!: ReservaDTO;
  precioTotal: number = 0;
  precioFinal: number = 0;

  promociones: { [codigo: string]: number } = {
    'DESCUENTO10': 10,
    'PROMO5': 5
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private compraService: CompraService
  ) { }

  ngOnInit() {
    const reservaGuardada = localStorage.getItem('reservaActual');
    if (reservaGuardada) {
      this.reserva = JSON.parse(reservaGuardada);
    }

    this.compraForm = this.fb.group({
      metodoPago: ['', Validators.required],
      promocionAplicada: [''],
      descuentoAplicado: [0]
    });

    // Escuchar cambios en el código de promoción
    this.compraForm.get('promocionAplicada')?.valueChanges.subscribe(codigo => {
      this.aplicarPromocion(codigo);
    });

    this.calcularPrecioTotal();
  }

  calcularPrecioTotal() {
    if (!this.reserva?.asientos) return;

    this.precioTotal = this.reserva.asientos.reduce((sum, a) => sum + a.precio, 0);
    const descuento = this.compraForm.get('descuentoAplicado')?.value || 0;
    this.precioFinal = this.precioTotal - descuento;
  }

  aplicarPromocion(codigo: string) {
    const descuento = this.promociones[codigo?.toUpperCase()] || 0;
    this.compraForm.patchValue({ descuentoAplicado: descuento }, { emitEvent: false });
    this.precioFinal = this.precioTotal - descuento;
  }

async confirmarCompra() {
  if (this.compraForm.invalid) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Debe seleccionar un método de pago.',
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

  // Construir DTO respetando los tipos del frontend
  const compraDto: CompraDTO = {
    id: 0,
    reservaId: this.reserva!.id, 
    metodoPago: this.compraForm.value.metodoPago,
    fechaHoraCompra: new Date().toISOString(), // convertir a string
    precioTotal: this.precioTotal,
    descuentoAplicado: this.compraForm.value.descuentoAplicado,
    promocionAplicada: this.compraForm.value.promocionAplicada || '',
    codigoQR: '',
    notificado: false,
    estado: 'ACTIVA'
  };

  try {
    // Enviar al backend usando lastValueFrom para convertir el Observable en Promise
    await lastValueFrom(this.compraService.registrarCompra(compraDto));

    const alert = await this.alertController.create({
      header: 'Compra exitosa',
      message: `Su compra se ha completado correctamente. Total a pagar: $${this.precioFinal.toFixed(2)}`,
      buttons: ['Ok']
    });
    await alert.present();

    this.router.navigate(['/home']);
  } catch (error: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: `No se pudo completar la compra: ${error.message || error}`,
      buttons: ['Ok']
    });
    await alert.present();
  }
}
}
