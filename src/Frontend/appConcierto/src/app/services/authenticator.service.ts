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


@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {

  private apiUrl = 'http://localhost:5065/api/Usuario/login';

  constructor(private http: HttpClient) { }

  login(usuario: UsuarioLoginDTO): Observable<UsuarioRespuestaDTO> {
    return this.http.post<UsuarioRespuestaDTO>(this.apiUrl, usuario);
  }
}
