import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConciertoService } from '../services/concierto.service';

@Component({
  selector: 'app-edicion-concierto',
  standalone : false,
  templateUrl: './edicion-concierto.page.html',
  styleUrls: ['./edicion-concierto.page.scss'],
})
export class EdicionConciertoPage implements OnInit {

  conciertoEditForm!: FormGroup;
  modoEdicion = false;
  modoOscuroActivado = false;
  conciertoId!: number; 

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private conciertoService: ConciertoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.inicializarFormulario();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEdicion = true;
      this.conciertoId = Number(idParam);
      this.cargarConcierto(this.conciertoId);
    }
  }

  inicializarFormulario() {
    this.conciertoEditForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(50)]],
      fecha: ['', Validators.required],
      lugar: ['', Validators.required],
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
      // Rellenar el formulario con los datos del concierto
      this.conciertoEditForm.patchValue({
        nombre: concierto.nombre,
        descripcion: concierto.descripcion,
        fecha: concierto.fecha,
        lugar: concierto.lugar,
        capacidad: concierto.capacidad
      });

      // Limpiar arrays antes de llenarlos
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
        this.archivosMultimedia.push(this.fb.group({
          nombreArchivo: [archivo.nombreArchivo, Validators.required],
          urlTemporal: [archivo.contenido || ''],
          tipo: [archivo.tipo || '']
        }));
      });
    }, error => {
      console.error('Error cargando concierto:', error);
      // Opcional: Navegar a otra página si no existe el concierto
    });
  }

  editarConcierto() {
    this.conciertoService.actualizarConcierto(this.conciertoId, this.conciertoEditForm.value).subscribe(() => {
      // Mostrar mensaje de éxito, luego navegar
      alert('Concierto actualizado correctamente.');
      this.router.navigate(['/home']);
    }, error => {
      console.error('Error actualizando concierto:', error);
    });
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
