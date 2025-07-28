import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule, Router, Route } from '@angular/router';
import { AuthenticatorService } from '../services/authenticator.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value;

  if (!val) {
    return { required: true };
  }

  const errors: ValidationErrors = {};

  if (val.length < 8) {
    errors['minLength'] = true;
  }
  if (!/[A-Z]/.test(val)) {
    errors['uppercase'] = true;
  }
  if (!/\d/.test(val)) {
    errors['number'] = true;
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\];'/+=~`]/.test(val)) {
    errors['symbol'] = true;
  }

  return Object.keys(errors).length ? errors : null;
}

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule
  ]
})
export class CrearUsuarioPage implements OnInit {

  registerForm!: FormGroup;
  modoOscuroActivado = false;

  constructor(
    private fb: FormBuilder,
    private authenticatorService: AuthenticatorService,
    private router: Router,
    private alertController: AlertController
  ) { }





  ngOnInit() {

    this.registerForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [passwordValidator]],
      rol: ['', [Validators.required]]
    });
  }

  private async mostrarAlertaClaveIncorrecta() {
    const alert = await this.alertController.create({
      header: 'Clave incorrecta',
      message: 'No se puede registrar este tipo de usuario.',
      buttons: ['Ok']
    });
    await alert.present();
  }

  async registrar() {
    if (this.registerForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Formulario inválido',
        message: 'Por favor, ingrese la información correctamente.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const usuario = this.registerForm.value;
    const rolUsuario = this.registerForm.get('rol')?.value;

    // Verifica si requiere clave especial
    if (rolUsuario === 'administrador' || rolUsuario === 'promotor') {
      const claveCorrecta = 'clave123'; // Aquí puedes poner la clave que tú definas

      const alert = await this.alertController.create({
        header: 'Clave requerida',
        message: `Para crear un usuario con rol "${rolUsuario}", ingrese la clave autorizada.`,
        inputs: [
          {
            name: 'clave',
            type: 'password',
            placeholder: 'Ingrese la clave'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Aceptar',
            handler: (data) => {
              if (data.clave === claveCorrecta) {
                this.procesarRegistro(usuario);
              } else {
                this.mostrarAlertaClaveIncorrecta();
              }
            }
          }
        ]
      });

      await alert.present();
    } else {
      // Si es rol normal (por ejemplo: "usuario"), no pide clave
      this.procesarRegistro(usuario);
    }
  }

  async procesarRegistro(usuario: any) {

    this.authenticatorService.registrarUsuario(usuario).subscribe(
      async (response) => {
        const alert = await this.alertController.create({
          header: 'Bienvenido',
          message: 'Registro exitoso.',
          buttons: ['Ok']
        });
        await alert.present();
        this.router.navigate(['/login']);
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'El correo ya esta en uso.',
          buttons: ['Ok']
        });
        await alert.present();
      }
    );
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
