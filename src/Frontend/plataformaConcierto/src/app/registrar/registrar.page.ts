import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  usuarioForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private userService: UsuarioService,
    private alertController: AlertController
  ) { }

  ngOnInit() {

    this.usuarioForm = this.fb.group(
      {
        Id: [null, [Validators.required, Validators.min(1)]],
        NombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
        CorreoElectronico: ['', [Validators.required, Validators.email]],
        Contrasena: ['', [Validators.required, Validators.minLength(8)]],
        Rol: ['', [Validators.required]]
      }
    );
  }

  async registrarUsuario() {
    if (this.usuarioForm.valid) {
      const nuevoUsuario = this.usuarioForm.value;

      this.userService.registrarUsuario(nuevoUsuario).subscribe(

        async (response) => {
          console.log('Usuario registrado con exito', response);

          const alert = await this.alertController.create(
            {
              header: 'Exito',
              message: 'Usuario Registrado',
              buttons: ['Ok']
            }
          );
          await alert.present();
        },
        async (error) => {
          console.log('Usuario no registrado', error);

          const alert = await this.alertController.create(
            {
              header: 'Error',
              message: 'Usuario No Registrado',
              buttons: ['Ok']
            }
          );
          await alert.present();
        }
      );
    } else {

      const alert = await this.alertController.create(
        {
          header: 'Formulario Invalido',
          message: 'Completo todos los campos',
          buttons: ['Ok']
        }
      );
      await alert.present();
    }
  }

}
