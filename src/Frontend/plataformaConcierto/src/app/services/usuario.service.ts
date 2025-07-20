import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface Usuario {
  Id: number;
  NombreCompleto: string;
  CorreoElectronico: string;
  Contrasena: string;
  Rol: string;
  ConciertosCreados: Concierto[];
}

interface UsuarioGetDTO {
  Id: number;
  NombreCompleto: string;
  CorreoElectronico: string;
  Contrasena: string;
  ConciertosCreados: Concierto[];
}

export interface Concierto {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Fecha: string; // o Date si conviertes después
  Lugar: string;
  Capacidad: number;
  CategoriasAsiento: CategoriaAsiento[];
  ArchivosMultimedia: ArchivoMultimedia[];
  UsuarioID: number;
  Usuario: Usuario;
}

export interface CategoriaAsiento {
  Id: number;
  Nombre: string;
  CantidadAsientos: number;
  Precio: number;
  ConciertoId: number;
  // Concierto?: Concierto; // solo si lo necesitas, cuidado con referencias circulares
}

export interface ArchivoMultimedia {
  Id: number;
  Contenido?: string; // base64 o URL para mostrar archivos
  NombreArchivo: string;
  Tipo: string; // 'imagen/png', 'video/mp4', etc.
  ConciertoId: number;
  // Concierto?: Concierto; // opcional
}




@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiURL = 'http://localhost:5065/api/Usuario';

  constructor(private http: HttpClient) { }

  obtenerUsuarios():Observable<UsuarioGetDTO[]>{
    
    return this.http.get<UsuarioGetDTO[]> (this.apiURL);
  }

  registrarUsuario(usuarioDto: any): Observable<any>{
    return this.http.post<any>(this.apiURL, usuarioDto);
  }
}
