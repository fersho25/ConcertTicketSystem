import { Component, OnInit } from '@angular/core';
import { Email, EmailService } from '../services/email.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthenticatorService, CambiarContrasenaDTO } from '../services/authenticator.service';


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

export function correoGmailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;
  if (!email) return { required: true };


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { email: true };


  if (!email.endsWith('@gmail.com')) return { dominioInvalido: true };

  return null;
}
@Component({
  selector: 'app-recuperacion-contrasena',
  standalone: false,
  templateUrl: './recuperacion-contrasena.page.html',
  styleUrls: ['./recuperacion-contrasena.page.scss'],
})
export class RecuperacionContrasenaPage implements OnInit {

  modoOscuroActivado = false;
  recuperarContraForm!: FormGroup;
  enviarOTPForm!: FormGroup;
  OTPEnviado = false;
  email!: Email;
  datos!: CambiarContrasenaDTO;

  otpsTemporales: { email: string, codigo: number, creadoEn: Date }[] = [];
  readonly minutosValidez = 5;
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authenticatorService: AuthenticatorService,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
    this.modoOscuroActivado = modoOscuro;
    if (modoOscuro) {
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
    }
    this.recuperarContraForm = this.fb.group({
      correoElectronico: ['@gmail.com', [Validators.required, correoGmailValidator]],
      contrasena: ['', [passwordValidator]],
      OTP: ['', [Validators.required]],
    });

    this.enviarOTPForm = this.fb.group({
      To: ['@gmail.com', [Validators.required,correoGmailValidator]],
    });
  }


  purgarOtpsExpirados() {
    const ahora = new Date();
    this.otpsTemporales = this.otpsTemporales.filter(o => {
      const minutosDiferencia = (ahora.getTime() - o.creadoEn.getTime()) / 1000 / 60;
      return minutosDiferencia <= this.minutosValidez;
    });
  }

  async volverEnviarOTP() {
    this.OTPEnviado = false;
  }



  async volver() {
    this.navCtrl.back();
  }

  generacionDeOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  async enviarOTP() {

    const otp = this.generacionDeOTP();
    const emailInput = this.enviarOTPForm.value.To;
    this.purgarOtpsExpirados();
    this.otpsTemporales = this.otpsTemporales.filter(o => o.email !== emailInput);

    this.otpsTemporales.push({
      email: emailInput,
      codigo: otp,
      creadoEn: new Date()
    });

    const to = this.enviarOTPForm.value.To;

    const email: Email = {
      To: to,
      Subject: 'Recuperacion de Contraseña',
      Body: `Tu código OTP es: ${otp}`

    };

    this.emailService.EnviarCorreo(email).subscribe(
      async () => {
        const alert = await this.alertController.create({
          header: 'OTP Enviado',
          message: `Tu código OTP fue enviado al correo: ${to}`,
          buttons: ['Ok']
        });
        await alert.present();
        this.OTPEnviado = true;
      },
      async (error) => {
        console.error('Error al enviar el OTP:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo enviar el OTP.',
          buttons: ['Ok']
        });
        await alert.present();
      }
    );
  }


  async recuperacionContrasena() {
    const { correoElectronico, OTP, contrasena } = this.recuperarContraForm.value;

    this.purgarOtpsExpirados();

    const otpIndex = this.otpsTemporales.findIndex(o =>
      o.email === correoElectronico && o.codigo == OTP
    );

    if (otpIndex === -1) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'OTP incorrecto o expirado. Genera uno nuevo.',
        buttons: ['Ok']
      });
      await alert.present();
      return;
    }

    this.otpsTemporales.splice(otpIndex, 1);

    this.datos = {
      correoElectronico: correoElectronico,
      nuevaContrasena: contrasena
    };

    this.authenticatorService.cambiarContrasena(this.datos).subscribe(
      async (res) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Contraseña cambiada con exito',
          buttons: ['Ok']
        });
        await alert.present();
        this.recuperarContraForm.reset();
        this.router.navigate(['/login']);
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Error cambiando la contraseña',
          buttons: ['Ok']
        });
        await alert.present();
      });
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