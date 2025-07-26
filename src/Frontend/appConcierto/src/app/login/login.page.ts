import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthenticatorService } from '../services/authenticator.service';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule
  ]
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authenticatorService: AuthenticatorService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  async onLogin() {

    if (this.loginForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Formulario inválido',
        message: 'Por favor, ingrese la información correctamente.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    const usuarioDto = this.loginForm.value;

    this.authenticatorService.login(usuarioDto).subscribe(
      async (response) => {
        const alert = await this.alertController.create({
          header: 'Bienvenido',
          message: 'Inicio de sesión exitoso.',
          buttons: ['Ok']
        });
        await alert.present();

        
       localStorage.setItem('usuario', JSON.stringify(response));

        this.router.navigate(['/home']);
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Credenciales incorrectas o problema en el servidor.',
          buttons: ['Ok']
        });
        await alert.present();
      }
    );
  }

}
