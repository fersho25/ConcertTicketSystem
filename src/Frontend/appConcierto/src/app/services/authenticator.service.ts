import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface UsuarioLoginDTO {
  correoElectronico: string;
  contrasena: string;
}

export interface UsuarioRespuestaDTO {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  rol: string;
}

export interface UsuarioDTO {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  contrasena: string;
  rol: string;
}

export interface UsuarioActualizarDTO {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  ContrasenaActual: string;
  ContrasenaNueva?: string;
}
export interface UsuarioActualizarAdminDTO {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  rol: string;
}
export interface CambiarContrasenaDTO {
  correoElectronico: string;
  nuevaContrasena: string;
}





@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {

  private loginUrl = 'https://localhost:7131/api/Usuario/login';
  private url = 'https://localhost:7131/api/Usuario';


  constructor(private http: HttpClient) { }

  login(usuario: UsuarioLoginDTO): Observable<UsuarioRespuestaDTO> {
    return this.http.post<UsuarioRespuestaDTO>(this.loginUrl, usuario);
  }

  registrarUsuario(usuario: UsuarioDTO): Observable<boolean> {
    return this.http.post<boolean>(this.url, usuario);
  }


  obtenerUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.url);
  }

  obtenerUsuarioPorId(id: number): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.url}/${id}`);
  }

  actualizarUsuario(id: number, usuario: UsuarioActualizarDTO): Observable<boolean> {
    return this.http.put<boolean>(`${this.url}/${id}`, usuario);
  }


  eliminarUsuario(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}`);
  }

  obtenerUsuarioAdministrador(id: number): Observable<UsuarioActualizarAdminDTO> {
    return this.http.get<UsuarioActualizarAdminDTO>(`${this.url}/admin/${id}`);
  }

  actualizarUsuarioAdministrador(id: number, usuario: UsuarioActualizarAdminDTO): Observable<boolean> {
    return this.http.put<boolean>(`${this.url}/admin/${id}`, usuario);
  }

  cambiarContrasena(dto: CambiarContrasenaDTO): Observable<string> {
    return this.http.post<string>(`${this.url}/cambiar-contrasena`, dto);
  }

}
