import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConciertoDTO, ConciertoService, VentaDTO } from '../services/concierto.service';
import { AlertController, IonContent, NavController } from '@ionic/angular';


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
  selector: 'app-edicion-concierto',
  standalone: false,
  templateUrl: './edicion-concierto.page.html',
  styleUrls: ['./edicion-concierto.page.scss'],
})
export class EdicionConciertoPage implements OnInit {

  conciertoEditForm!: FormGroup;
  modoOscuroActivado = false;
  conciertoId!: number;
  concierto!: ConciertoDTO;
  formularioCargado = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private conciertoService: ConciertoService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.inicializarFormulario();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.conciertoId = Number(idParam);
      this.cargarConcierto(this.conciertoId);
    } else {
      this.router.navigate(['/home']);
    }
  }
  async volver() {
    const alert = await this.alertController.create({
      header: 'Perderás los cambios',
      message: 'Si sales de la edición tus cambios no se verán reflejados.',
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
            this.navCtrl.back();
          }
        }
      ]
    });

    await alert.present();
  }

  inicializarFormulario() {
    this.conciertoEditForm = this.fb.group({
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
    return this.conciertoEditForm.get('promociones') as FormArray;
  }

  get categoriasAsiento() {
    return this.conciertoEditForm.get('categoriasAsiento') as FormArray;
  }

  get archivosMultimedia() {
    return this.conciertoEditForm.get('archivosMultimedia') as FormArray;
  }

  cargarConcierto(id: number) {
    this.conciertoService.obtenerConciertoPorId(id).subscribe(concierto => {
      this.concierto = concierto;
      if (this.formularioCargado) return;

      // Resetear formulario con valores del concierto
      this.conciertoEditForm.reset({
        nombre: concierto.nombre,
        descripcion: concierto.descripcion,
        fecha: concierto.fecha,
        lugar: concierto.lugar,
        capacidad: concierto.capacidad,
        venta: {
          fechaFin: concierto.venta?.fechaFin || '',
          estado: concierto.venta?.estado || ''
        }
      });

      // Cargar categorías de asiento
      this.categoriasAsiento.clear();
      concierto.categoriasAsiento.forEach(cat => {
        this.categoriasAsiento.push(this.fb.group({
          nombre: [cat.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
          precio: [cat.precio, [Validators.required, Validators.min(1)]],
          cantidad: [cat.cantidad, [Validators.required, Validators.min(1)]]
        }));
      });

      // Cargar archivos multimedia
      this.archivosMultimedia.clear();
      concierto.archivosMultimedia.forEach(archivo => {
        const urlTemp = archivo.contenido ? `data:${archivo.tipo};base64,${archivo.contenido}` : '';
        this.archivosMultimedia.push(this.fb.group({
          contenido: [archivo.contenido || '', Validators.required],
          nombreArchivo: [archivo.nombreArchivo || '', [Validators.required, Validators.minLength(3)]],
          tipo: [archivo.tipo || ''],
          urlTemporal: [urlTemp]
        }));
      });

      this.promociones.clear();
      concierto.promociones.forEach(promocion => {
        this.promociones.push(this.fb.group({
          nombre: [promocion.nombre, [Validators.required, Validators.minLength(3)]],
          descuento: [promocion.descuento, [Validators.required, Validators.min(1), Validators.max(100)]],
          fechaFin: [promocion.fechaFin, Validators.required],
          activa: [promocion.activa, Validators.required]
        }));
      });



      this.formularioCargado = true;
    }, error => {
      console.error('Error cargando concierto:', error);
    });
  }




  onSubmit() {
    if (this.concierto?.venta?.estado === 'Inactivo') {
      this.editarConcierto(); // Edita todo el concierto
    } else {
      this.editarConciertoEnVenta(); // Solo campos permitidos mientras la venta está activa
    }
  }

  async editarConciertoEnVenta() {
    // Por ejemplo, solo actualizar descripción y archivos multimedia
    const archivosMultimedia = this.archivosMultimedia.controls.map(a => ({
      id: a.get('id')?.value || 0,
      nombreArchivo: a.get('nombreArchivo')?.value,
      tipo: a.get('tipo')?.value,
      contenido: a.get('contenido')?.value,
      conciertoId: this.conciertoId
    }));

    const data: Partial<ConciertoDTO> = {
      descripcion: this.conciertoEditForm.get('descripcion')?.value,
      archivosMultimedia
    };

    this.conciertoService.actualizarConcierto(this.conciertoId, { ...this.concierto, ...data })
      .subscribe(async () => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Concierto actualizado correctamente.',
          buttons: ['Ok']
        });
        await alert.present();
        this.router.navigate(['/home']);
      }, async error => {
        console.error('Error al actualizar concierto:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo actualizar el concierto.',
          buttons: ['Ok']
        });
        await alert.present();
      });
  }



  async editarConcierto() {
    if (
      this.conciertoEditForm.invalid ||
      this.cantidadRestante !== 0 ||
      this.categoriasAsiento.length === 0 ||
      !this.hayArchivo() ||
      this.conciertoEditForm.hasError('fechaFinMayor') ||
      this.conciertoEditForm.hasError('fechaFinPasada')
    ) {
      const alert = await this.alertController.create({
        header: 'Concierto inválido',
        message: 'Verifique que todos los campos estén completos, que las fechas sean correctas, haya al menos un archivo multimedia y que se hayan asignado todos los asientos.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuarioID = usuario.id;

    // Filtrar archivos multimedia válidos
    const archivosMultimedia = this.conciertoEditForm.value.archivosMultimedia.filter(
      (archivo: any) => archivo.nombreArchivo && archivo.contenido
    );

    // Filtrar categorías válidas
    const categoriasAsiento = this.conciertoEditForm.value.categoriasAsiento.filter(
      (categoria: any) =>
        categoria.nombre && categoria.nombre.trim() !== '' &&
        categoria.precio > 0 &&
        categoria.cantidad > 0
    );

    const promociones = this.conciertoEditForm.value.promociones.filter(
      (promocion: any) =>
        promocion.nombre && promocion.nombre.trim() !== '' &&
        promocion.descuento > 0 && promocion.descuento <= 100 &&
        promocion.fechaFin !== null &&
        promocion.activa !== null
    );

    // Obtener venta como objeto
    const ventaForm: VentaDTO = this.conciertoEditForm.get('venta')?.value;

    const conciertoEditado: ConciertoDTO = {
      ...this.conciertoEditForm.value,
      id: this.conciertoId,
      usuarioID: usuarioID,
      archivosMultimedia,
      categoriasAsiento,
      promociones,
      venta: {
        id: ventaForm.id || 0,
        conciertoId: this.conciertoId,
        fechaFin: ventaForm.fechaFin,
        estado: ventaForm.estado
      }
    };

    // console.log('Concierto que se envia:', conciertoEditado);

    this.conciertoService.actualizarConcierto(this.conciertoId, conciertoEditado).subscribe(
      async () => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Concierto actualizado correctamente.',
          buttons: ['Ok']
        });
        await alert.present();
        this.router.navigate(['/home']);
      },
      async (error) => {
        console.error('Error al actualizar concierto:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo editar el concierto.',
          buttons: ['Ok']
        });
        await alert.present();
      }
    );
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
      descuento: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      activa: [null, Validators.required]
    });
  }

  fechaPromocionValidaValidator = (formArray: AbstractControl): ValidationErrors | null => {
    if (!(formArray instanceof FormArray)) return null;

    const conciertoFechaControl = this.conciertoEditForm?.get('fecha');
    const ventaFechaFinControl = this.conciertoEditForm?.get('venta.fechaFin');
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
    console.log(this.archivosMultimedia.value);
  }

  onArchivoSeleccionado(event: any, index: number) {
    const archivo = event.target.files[0];

    if (archivo) {
      const tiposPermitidos = ['image/jpeg', 'image/png', 'video/mp4'];
      if (!tiposPermitidos.includes(archivo.type)) {
        alert("Tipo de archivo no permitido.");
        return;
      }

      const tamanioMaximoMB = 10;
      if (archivo.size > tamanioMaximoMB * 1024 * 1024) {
        alert(`El archivo excede ${tamanioMaximoMB}MB.`);
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        const urlTemp = URL.createObjectURL(archivo);

        // Guardar todo en el formArray
        this.archivosMultimedia.at(index).patchValue({
          contenido: base64,        // Para enviar al backend
          nombreArchivo: archivo.name,
          tipo: archivo.type,       // Para distinguir imagen o video
          urlTemporal: urlTemp      // Para previsualización
        });
      };

      reader.readAsDataURL(archivo);
    }
  }

  get capacidad(): number {
    return this.conciertoEditForm?.get('capacidad')?.value || 0;
  }

  get cantidadRestante(): number {
    const capacidad = this.conciertoEditForm.get('capacidad')?.value || 0;
    const totalAsignado = this.categoriasAsiento.controls.reduce((suma, categoria) => {
      const cantidad = categoria.get('cantidad')?.value || 0;
      return suma + cantidad;
    }, 0);
    return capacidad - totalAsignado;
  }

  hayArchivo(): boolean {
    if (!this.archivosMultimedia || !this.archivosMultimedia.controls) return false;

    return this.archivosMultimedia.controls.some(archivo =>
      archivo.get('tipo')?.value?.startsWith('image/') ||
      archivo.get('tipo')?.value?.startsWith('video/')
    );
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
