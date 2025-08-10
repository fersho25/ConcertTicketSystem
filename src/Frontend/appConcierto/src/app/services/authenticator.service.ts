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


@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {

  private loginUrl = 'http://localhost:5065/api/Usuario/login';
  private registerUrl = 'http://localhost:5065/api/Usuario';

  constructor(private http: HttpClient) { }

  login(usuario: UsuarioLoginDTO): Observable<UsuarioRespuestaDTO> {
    return this.http.post<UsuarioRespuestaDTO>(this.loginUrl, usuario);
  }

  registrarUsuario(usuario: UsuarioDTO): Observable<boolean> {
    return this.http.post<boolean>(this.registerUrl, usuario);
  }
}
