import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthenticatorService, UsuarioActualizarDTO, UsuarioDTO } from '../services/authenticator.service';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-editar-usuario',
  standalone: false,
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {

  usuarioEditForm!: FormGroup;
  modoOscuroActivado = false;
  usuarioActualozar!: UsuarioActualizarDTO;
  usuario!: UsuarioDTO;
  contrasenaNueva = false;
  formularioCargado = false;
  usuarioActual: any = {};

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private fb: FormBuilder,
    private authenticatorService: AuthenticatorService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.inicializarFormulario();
    this.usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.cargarUsuario(id);
    }

    const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
    this.modoOscuroActivado = modoOscuro;
    if (modoOscuro) {
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
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
    this.usuarioEditForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]],
      rol: ['', [Validators.required]],
      contrasenaNueva: ['']
    });
  }


  cargarUsuario(id: number) {
    this.authenticatorService.obtenerUsuarioPorId(id).subscribe(usuario => {
      this.usuario = usuario;

      if (this.formularioCargado) return;

      this.usuarioEditForm.reset({
        nombreCompleto: usuario.nombreCompleto,
        correoElectronico: usuario.correoElectronico,
        contrasena: '',
        rol: usuario.rol
      });

      this.formularioCargado = true;

    }, error => {
      console.error("Error cargando el usuario")
    });
  }
  async editarUsuario() {
    if (this.usuarioEditForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Información inválida',
        message: 'Verifique que todos los campos estén completos y correctamente rellenados',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }
    console.log(this.usuarioEditForm.value);
    const usuarioActualizar: UsuarioActualizarDTO = {
      id: this.usuario.id,
      nombreCompleto: this.usuarioEditForm.value.nombreCompleto,
      correoElectronico: this.usuarioEditForm.value.correoElectronico,
      rol: this.usuarioEditForm.value.rol,
      ContrasenaActual: this.usuarioEditForm.value.contrasena,
      ContrasenaNueva: this.contrasenaNueva ? this.usuarioEditForm.value.contrasenaNueva : ''
    };

    this.authenticatorService.actualizarUsuario(this.usuario.id, usuarioActualizar)
      .subscribe(
        async (res) => {

          const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
          if (usuarioGuardado.id === this.usuario.id) {
            localStorage.setItem('usuario', JSON.stringify({
              ...usuarioGuardado,
              nombreCompleto: usuarioActualizar.nombreCompleto,
              correoElectronico: usuarioActualizar.correoElectronico,
              rol: usuarioActualizar.rol
            }));
          }
          const alert = await this.alertController.create({
            header: 'Éxito',
            message: 'Usuario actualizado correctamente.',
            buttons: ['Ok']
          });
          await alert.present();
          this.router.navigate(['/home']);
        },
        async (error) => {
          const alert = await this.alertController.create({
            header: 'Error',
            message: error.error,
            buttons: ['Ok']
          });
          await alert.present();
          console.error(error);

        });
  }


  habilitarNuevaContrasena() {
    this.contrasenaNueva = !this.contrasenaNueva;
    const nuevaContraControl = this.usuarioEditForm.get('contrasenaNueva');

    if (this.contrasenaNueva) {
      nuevaContraControl?.setValidators([Validators.required, passwordValidator]);
    } else {
      nuevaContraControl?.clearValidators();
      nuevaContraControl?.setValue('');
    }

    nuevaContraControl?.updateValueAndValidity();
  }



  ionViewWillEnter() {
    const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
    this.modoOscuroActivado = modoOscuro;

    if (modoOscuro) {
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
    }
  }


  darkPaletteToggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }

  toggleDarkPalette(shouldAdd: boolean) {
    if (shouldAdd) {
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
    }
    localStorage.setItem('modoOscuro', JSON.stringify(shouldAdd));
    this.modoOscuroActivado = shouldAdd;
  }


}
