import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule, Router, Route } from '@angular/router';
import { AuthenticatorService } from '../services/authenticator.service';


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
      contrasena: ['', [Validators.required, Validators.minLength(1)]],
      rol: ['', [Validators.required]]
    });
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
          message: 'Registro incorrecto.',
          buttons: ['Ok']
        });
        await alert.present();
      }
    );
  }

}
