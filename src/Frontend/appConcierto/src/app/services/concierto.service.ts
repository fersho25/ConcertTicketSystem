import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoriaAsientoDTO {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  conciertoId: number;
}

export interface ArchivoMultimediaDTO {
  id: number;
  contenido: string; // base64 o URL
  nombreArchivo: string;
  tipo: string; // por ejemplo "imagen", "video"
  conciertoId: number;
}

export interface ConciertoDTO {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string; // se puede dejar como string ISO
  lugar: string;
  capacidad: number;
  usuarioID: number;

  categoriasAsiento: CategoriaAsientoDTO[];
  archivosMultimedia: ArchivoMultimediaDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class ConciertoService {
  private baseUrl = 'http://localhost:5065/api/Concierto';

  constructor(private http: HttpClient) {}

  obtenerConciertos(): Observable<ConciertoDTO[]> {
    return this.http.get<ConciertoDTO[]>(this.baseUrl);
  }

  obtenerConciertoPorId(id: number): Observable<ConciertoDTO> {
    return this.http.get<ConciertoDTO>(`${this.baseUrl}/${id}`);
  }

  registrarConcierto(concierto: ConciertoDTO): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl, concierto);
  }

  actualizarConcierto(id: number, concierto: ConciertoDTO): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/${id}`, concierto);
  }

  eliminarConcierto(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  eliminarArchivoMultimedia(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/archivoMultimedia/${id}`);
  }

  eliminarCategoriaAsiento(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/categoriaAsiento/${id}`);
  }
}
