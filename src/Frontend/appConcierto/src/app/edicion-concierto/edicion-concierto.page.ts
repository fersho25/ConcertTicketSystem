import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConciertoService } from '../services/concierto.service';
import { AlertController, NavController } from '@ionic/angular';


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
      categoriasAsiento: this.fb.array([]),
      archivosMultimedia: this.fb.array([])
    });
  }

  get categoriasAsiento() {
    return this.conciertoEditForm.get('categoriasAsiento') as FormArray;
  }

  get archivosMultimedia() {
    return this.conciertoEditForm.get('archivosMultimedia') as FormArray;
  }

  cargarConcierto(id: number) {
    this.conciertoService.obtenerConciertoPorId(id).subscribe(concierto => {
      if (this.formularioCargado) return;

      this.conciertoEditForm.reset({
        nombre: concierto.nombre,
        descripcion: concierto.descripcion,
        fecha: concierto.fecha,
        lugar: concierto.lugar,
        capacidad: concierto.capacidad
      });

      this.categoriasAsiento.clear();
      concierto.categoriasAsiento.forEach(cat => {
        this.categoriasAsiento.push(this.fb.group({
          nombre: [cat.nombre, Validators.required],
          precio: [cat.precio, [Validators.required, Validators.min(0)]],
          cantidad: [cat.cantidad, [Validators.required, Validators.min(1)]]
        }));
      });

      this.archivosMultimedia.clear();
      concierto.archivosMultimedia.forEach(archivo => {
        const base64Data = archivo.contenido || '';
        const tipo = archivo.tipo || '';
        let urlTemp = '';

        if (base64Data && tipo) {
          urlTemp = `data:${tipo};base64,${base64Data}`;
        }

        this.archivosMultimedia.push(this.fb.group({
          contenido: [base64Data, Validators.required],
          nombreArchivo: [archivo.nombreArchivo, Validators.required],
          tipo: [tipo],
          urlTemporal: [urlTemp]
        }));
      });

      this.formularioCargado = true;
    }, error => {
      console.error('Error cargando concierto:', error);
    });
  }



  async editarConcierto() {
    if (
      this.conciertoEditForm.invalid ||
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
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuarioID = usuario.id;

    const formValue = this.conciertoEditForm.value;


    formValue.archivosMultimedia = formValue.archivosMultimedia.filter(
      (archivo: any) => archivo.nombreArchivo && archivo.contenido
    );


    formValue.categoriasAsiento = formValue.categoriasAsiento.filter(
      (categoria: any) =>
        categoria.nombre && categoria.nombre.trim() !== '' &&
        categoria.precio > 0 &&
        categoria.cantidad > 0
    );

    const conciertoEditado = {
      ...formValue,
      id: this.conciertoId,

      usuarioID: usuarioID
    };
    console.log('Concierto que enviarás:', conciertoEditado);

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
