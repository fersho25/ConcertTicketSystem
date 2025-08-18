import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConciertoDTO, ConciertoService, PromocionDTO } from '../services/concierto.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { min } from 'rxjs';
import { CommonModule } from '@angular/common';

function fechaHoraFuturaValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;

  if (!valor) return null;

  const fechaIngresada = new Date(valor);
  const ahora = new Date();

  if (fechaIngresada <= ahora) {
    return { fechaHoraPasada: true };
  }

  return null;
}

@Component({
  selector: 'app-crear-concierto',
  standalone: true,
  templateUrl: './crear-concierto.page.html',
  styleUrls: ['./crear-concierto.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule
  ]
})

export class CrearConciertoPage implements OnInit {

  conciertoForm!: FormGroup;
  modoOscuroActivado = false;

  constructor(
    private fb: FormBuilder,
    private conciertoService: ConciertoService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.conciertoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(50)]],
      fecha: ['', [Validators.required, fechaHoraFuturaValidator]],
      lugar: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      capacidad: ['', [Validators.required, Validators.min(1)]],

      venta: this.fb.group({
        fechaFin: ['', Validators.required],
        estado: ['', Validators.required]
      }),
      promociones: this.fb.array([], this.fechaPromocionValidaValidator),
      categoriasAsiento: this.fb.array([]),
      archivosMultimedia: this.fb.array([])
    }, { validators: this.fechaFinValidaValidator });
  }

  get promociones(): FormArray {
    return this.conciertoForm.get('promociones') as FormArray;
  }
  get categoriasAsiento(): FormArray {
    return this.conciertoForm.get('categoriasAsiento') as FormArray;
  }

  get archivosMultimedia(): FormArray {
    return this.conciertoForm.get('archivosMultimedia') as FormArray;
  }

  crearCategoriaAsiento(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      cantidad: [0, [Validators.required, Validators.min(1)]],
    });
  }

  crearArchivoMultimedia(): FormGroup {
    return this.fb.group({
      contenido: ['', Validators.required],
      nombreArchivo: ['', [Validators.required, Validators.minLength(3)]],
      tipo: [''],
      urlTemporal: ['']
    });
  }

  crearPromocion(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fechaFin: ['', Validators.required],
      descuento: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      activa: [null, Validators.required]
    });
  }




  async crearConcierto() {
    if (
      this.conciertoForm.invalid ||
      this.cantidadRestante !== 0 ||
      this.categoriasAsiento.length === 0
    ) {
      const alert = await this.alertController.create({
        header: 'Concierto inválido',
        message: 'Verifique que todos los campos estén completos y que se hayan asignado todos los asientos.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const ventaForm = this.conciertoForm.get('venta')?.value;
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuarioID = usuario.id;

    const promocionesFormArray = this.conciertoForm.get('promociones') as FormArray;
    const promociones: PromocionDTO[] = promocionesFormArray?.controls.map(promoGroup => ({
      id: 0,
      nombre: promoGroup.get('nombre')?.value,
      descuento: promoGroup.get('descuento')?.value,
      fechaFin: promoGroup.get('fechaFin')?.value,
      activa: promoGroup.get('activa')?.value,
      conciertoId: 0
    })) || [];

    const concierto: ConciertoDTO = {
      ...this.conciertoForm.value,
      usuarioID: usuarioID,
      venta: {
        id: 0,
        conciertoId: 0,
        fechaFin: ventaForm.fechaFin,
        estado: ventaForm.estado
      },
      promociones: promociones
    };
    console.log(concierto);

    this.conciertoService.registrarConcierto(concierto).subscribe(
      async (response) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Concierto registrado correctamente.',
          buttons: ['Ok']
        });
        await alert.present();
        this.conciertoForm.reset();
        this.router.navigate(['/home']);
      },
      async (error) => {
        console.error('Error al registrar concierto:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo registrar el concierto.',
          buttons: ['Ok']
        });
        await alert.present();
      }
    );
  }




  onArchivoSeleccionado(event: any, index: number) {
    const archivo = event.target.files[0];

    if (archivo) {

      const tiposPermitidos = ['image/jpeg', 'image/png', 'video/mp4'];
      if (!tiposPermitidos.includes(archivo.type)) {
        alert("Tipo de archivo no permitido. Solo se permiten imágenes JPEG/PNG o videos MP4.");
        return;
      }


      const tamanioMaximoMB = 10;
      if (archivo.size > tamanioMaximoMB * 1024 * 1024) {
        alert(`El archivo excede el tamaño máximo permitido de ${tamanioMaximoMB}MB.`);
        return;
      }


      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.archivosMultimedia.at(index).patchValue({
          contenido: base64,
          nombreArchivo: archivo.name,
          tipo: archivo.type,
          urlTemporal: URL.createObjectURL(archivo)
        });
      };
      reader.readAsDataURL(archivo);
    }
  }

  hayArchivo(): boolean {
    if (!this.archivosMultimedia || !this.archivosMultimedia.controls) return false;

    return this.archivosMultimedia.controls.some(archivo =>
      archivo.get('tipo')?.value?.startsWith('image/') ||
      archivo.get('tipo')?.value?.startsWith('video/')
    );
  }

  get cantidadRestante(): number {
    const capacidad = this.conciertoForm.get('capacidad')?.value || 0;
    const totalAsignado = this.categoriasAsiento.controls.reduce((suma, categoria) => {
      const cantidad = categoria.get('cantidad')?.value || 0;
      return suma + cantidad;
    }, 0);
    return capacidad - totalAsignado;
  }

  fechaFinValidaValidator(group: AbstractControl): ValidationErrors | null {
    const fechaControl = group.get('fecha');
    const fechaFinControl = group.get('venta.fechaFin');

    if (!fechaControl || !fechaFinControl) return null;

    const fecha = new Date(fechaControl.value);
    const fechaFin = new Date(fechaFinControl.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // comparar solo fecha

    if (fechaFin > fecha) {
      return { fechaFinMayor: true };
    }

    if (fechaFin <= hoy) {
      return { fechaFinPasada: true };
    }

    return null;
  }


  fechaPromocionValidaValidator = (formArray: AbstractControl): ValidationErrors | null => {
    if (!(formArray instanceof FormArray)) return null;

    const conciertoFechaControl = this.conciertoForm?.get('fecha');
    const ventaFechaFinControl = this.conciertoForm?.get('venta.fechaFin');
    if (!conciertoFechaControl || !ventaFechaFinControl) return null;

    const conciertoFecha = new Date(conciertoFechaControl.value);
    const ventaFechaFin = new Date(ventaFechaFinControl.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let hayError = false;

    formArray.controls.forEach(promo => {
      const fechaFinControl = promo.get('fechaFin');
      if (!fechaFinControl || !fechaFinControl.value) return;

      const fechaFin = new Date(fechaFinControl.value);
      const errores: any = {};

      if (fechaFin <= hoy) errores.fechaFinPasada = true;
      if (fechaFin > conciertoFecha) errores.fechaFinMayorConcierto = true;
      if (fechaFin > ventaFechaFin) errores.fechaFinMayorVenta = true;

      if (Object.keys(errores).length > 0) {
        fechaFinControl.setErrors(errores);
        hayError = true;
      } else {
        fechaFinControl.setErrors(null);
      }
    });

    return hayError ? { promocionInvalida: true } : null;
  };

  promocionesValidas(): boolean {
    return this.promociones.controls.every(p => p.valid);
  }


  agregarPromocion() {
    this.promociones.push(this.crearPromocion());
  }

  eliminarPromocion(index: number) {
    this.promociones.removeAt(index);
  }


  agregarCategoriaAsiento() {
    this.categoriasAsiento.push(this.crearCategoriaAsiento());
  }

  agregarArchivoMultimedia() {
    this.archivosMultimedia.push(this.crearArchivoMultimedia());
  }

  removerCategoriaAsiento(index: number) {
    this.categoriasAsiento.removeAt(index);
  }

  removerArchivoMultimedia(index: number) {
    this.archivosMultimedia.removeAt(index);
  }

  get capacidad(): number {
    return this.conciertoForm?.get('capacidad')?.value || 0;
  }

  ionViewWillEnter() {
    // Leer estado guardado
    const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
    this.modoOscuroActivado = modoOscuro;

    // Aplicar o quitar clase dark al <html>
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
