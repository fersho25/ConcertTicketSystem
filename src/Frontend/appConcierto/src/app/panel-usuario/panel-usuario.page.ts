import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthenticatorService, UsuarioDTO } from '../services/authenticator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-usuario',
  standalone: false,
  templateUrl: './panel-usuario.page.html',
  styleUrls: ['./panel-usuario.page.scss'],
})
export class PanelUsuarioPage implements OnInit {

  modoOscuroActivado = false;

  usuarios: UsuarioDTO[] = [];

  constructor(
    private alertController: AlertController,
    private router: Router,
    private authenticatorService: AuthenticatorService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
  }


  cargarUsuarios() {
    this.authenticatorService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        console.error("Error cargando todos los usuarios")
      }
    });

  }

  editarUsuario(usuario: UsuarioDTO) {
    this.router.navigate(['/editar-usuario', usuario.id]); 
  }


  async eliminarUsuario(usuario: UsuarioDTO) {
  const alert = await this.alertController.create({
    header: `Confirmar eliminación de ${usuario.nombreCompleto}`,
    message: '¿Desea eliminar este usuario?',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        handler: () => {
          this.authenticatorService.eliminarUsuario(usuario.id).subscribe({
            next: () => this.cargarUsuarios(),
            error: async () => {
              const alertErr = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo eliminar el usuario.',
                buttons: ['OK']
              });
              await alertErr.present();
            }
          });
        }
      }
    ]
  });

  await alert.present();
}


  ionViewWillEnter() {

    const modoOscuro = JSON.parse(localStorage.getItem('modoOscuro') || 'false');
    this.modoOscuroActivado = modoOscuro;


    document.documentElement.classList.toggle('ion-palette-dark', modoOscuro);
    this.cargarUsuarios();
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
