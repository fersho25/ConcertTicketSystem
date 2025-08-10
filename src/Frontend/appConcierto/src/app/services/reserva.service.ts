import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AsientoReservaDTO {
  categoriaAsientoId: number;
  numeroAsiento: number;
  precio: number;
}

export interface ReservaDTO {
  id?: number; // opcional
  usuarioId: number;
  conciertoId: number;
  fechaHoraReserva: string;
  fechaHoraExpiracion: string;
  estado: string;
  metodoPago: string;
  fechaHoraCompra: string;
  precioTotal: number;
  descuentoAplicado: number;
  promocionAplicada?: string;
  codigoQR?: string;
  notificado: boolean;
  asientos: AsientoReservaDTO[];
}

export interface AsientoMapaDTO {
  categoriaAsientoId: number;
  categoriaNombre: string;
  numeroAsiento: number;
  precio: number;
  estado: 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO';
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private baseUrl = 'http://localhost:5065/api/Reserva';

  constructor(private http: HttpClient) {}

  obtenerReservas(): Observable<ReservaDTO[]> {
    return this.http.get<ReservaDTO[]>(this.baseUrl);
  }

  obtenerReservaPorId(id: number): Observable<ReservaDTO> {
    return this.http.get<ReservaDTO>(`${this.baseUrl}/${id}`);
  }

  registrarReserva(reserva: ReservaDTO): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl, reserva);
  }

  actualizarReserva(id: number, reserva: ReservaDTO): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/${id}`, reserva);
  }

  eliminarReserva(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }

   obtenerMapaAsientos(conciertoId: number): Observable<AsientoMapaDTO[]> {
  return this.http.get<AsientoMapaDTO[]>(`${this.baseUrl}/mapa-asientos/${conciertoId}`);

   }
}
