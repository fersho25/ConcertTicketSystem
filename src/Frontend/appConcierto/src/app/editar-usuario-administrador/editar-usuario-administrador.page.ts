import { Component, OnInit } from '@angular/core';
import { AuthenticatorService, UsuarioActualizarAdminDTO } from '../services/authenticator.service';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';


export function correoGmailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;
  if (!email) return { required: true };


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { email: true };


  if (!email.endsWith('@gmail.com')) return { dominioInvalido: true };

  return null;
}

@Component({
  selector: 'app-editar-usuario-administrador',
  standalone: false,
  templateUrl: './editar-usuario-administrador.page.html',
  styleUrls: ['./editar-usuario-administrador.page.scss'],
})
export class EditarUsuarioAdministradorPage implements OnInit {

  usuarioEditAdminForm!: FormGroup;
  modoOscuroActivado = false;
  usuario!: UsuarioActualizarAdminDTO;
  usuarioActualizar!: UsuarioActualizarAdminDTO;
  formularioCargado = false;

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
    this.usuarioEditAdminForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correoElectronico: ['', [Validators.required, correoGmailValidator]],
      rol: ['', [Validators.required]]
    });
  }

  cargarUsuario(id: number) {
    this.authenticatorService.obtenerUsuarioAdministrador(id).subscribe(usuario => {
      this.usuario = usuario;

      if (this.formularioCargado) return;

      this.usuarioEditAdminForm.reset({
        nombreCompleto: usuario.nombreCompleto,
        correoElectronico: usuario.correoElectronico,
        rol: usuario.rol,
      });

      this.formularioCargado = true;

    }, error => {
      console.error("Error cargando el usuario");
    });
  }

  async editarUsuarioAdmin() {
    if (this.usuarioEditAdminForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Información inválida',
        message: 'Verifique que todos los campos estén completos y correctamente rellenados',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    this.usuarioActualizar = {
      id: this.usuario.id,
      nombreCompleto: this.usuarioEditAdminForm.value.nombreCompleto,
      correoElectronico: this.usuarioEditAdminForm.value.correoElectronico,
      rol: this.usuarioEditAdminForm.value.rol
    };

    this.authenticatorService.actualizarUsuarioAdministrador(this.usuario.id, this.usuarioActualizar).subscribe(
      async (success) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Usuario actualizado correctamente.',
          buttons: ['Ok']
        });
        await alert.present();
        this.router.navigate(['/panel-usuario']);
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
