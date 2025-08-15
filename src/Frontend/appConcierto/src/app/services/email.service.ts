import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Email {
  To: string;
  Subject: string;
  Body: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private baseUrl = 'http://localhost:5065/api/Email/enviarCorreo';

  constructor(private http: HttpClient) { }

  EnviarCorreo(email: Email): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl, email)
  }

}
