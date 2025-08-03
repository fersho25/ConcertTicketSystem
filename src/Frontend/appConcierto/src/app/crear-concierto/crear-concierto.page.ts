import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConciertoDTO, ConciertoService } from '../services/concierto.service';
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
      categoriasAsiento: this.fb.array([]),
      archivosMultimedia: this.fb.array([])
    });
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
      tipo: ['', Validators.required],
      urlTemporal: ['']  // para la vista previa
    });
  }



  async crearConcierto() {
    if (this.conciertoForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Concierto inválido',
        message: 'Por favor, ingrese la información correctamente.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const concierto: ConciertoDTO = this.conciertoForm.value;

    this.conciertoService.registrarConcierto(concierto).subscribe(
      async (response) => {
        const alert = await this.alertController.create({
          header: 'Exito',
          message: 'Concierto registrado correctamente.',
          buttons: ['Ok']
        });
        await alert.present();
        this.conciertoForm.reset();
        this.router.navigate(['/home']);
      },
      async (error) => {
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
      // Guardamos el archivo como base64 para enviar
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
