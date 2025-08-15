import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AsientoReservaDTO {
  categoriaAsientoId: number;
  numeroAsiento: number;
  precio: number;
}

export interface CompraDTO {
  id: number;
  reservaId?: number;
  metodoPago: string;
  fechaHoraCompra: string;
  precioTotal: number;
  descuentoAplicado: number;
  promocionAplicada?: string;
  codigoQR?: string;
  notificado: boolean;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private baseUrl = 'http://localhost:5065/api/compra'; 

  constructor(private http: HttpClient) { }

  // Obtener todas las compras
  getCompras(): Observable<CompraDTO[]> {
    return this.http.get<CompraDTO[]>(`${this.baseUrl}`);
  }

  // Obtener compra por ID
  getCompraPorId(id: number): Observable<CompraDTO> {
    return this.http.get<CompraDTO>(`${this.baseUrl}/${id}`);
  }

  // Obtener compras por usuario
  getComprasPorUsuario(usuarioId: number): Observable<CompraDTO[]> {
    return this.http.get<CompraDTO[]>(`${this.baseUrl}/usuario/${usuarioId}`);
  }

  // Obtener compras por concierto
  getComprasPorConcierto(conciertoId: number): Observable<CompraDTO[]> {
    return this.http.get<CompraDTO[]>(`${this.baseUrl}/concierto/${conciertoId}`);
  }

  // Registrar nueva compra
  registrarCompra(compra: CompraDTO): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}`, compra);
  }

  // Actualizar compra
  actualizarCompra(id: number, compra: CompraDTO): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/${id}`, compra);
  }

  // Eliminar compra
  eliminarCompra(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  // Cambiar estado de compra
  cambiarEstado(id: number, nuevoEstado: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/${id}/cambiarEstado`, nuevoEstado);
  }

  // Obtener asientos de una compra
  getAsientosPorCompra(id: number): Observable<AsientoReservaDTO[]> {
    return this.http.get<AsientoReservaDTO[]>(`${this.baseUrl}/${id}/asientos`);
  }
}
