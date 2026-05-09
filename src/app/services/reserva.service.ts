import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Reserva {
  id?: number;
  gato_id: number;
  nome: string;
  email: string;
  telefone: string;
  status?: 'pendente' | 'confirmada' | 'cancelada';
  data_solicitacao?: Date;
  observacoes?: string;
  Gato?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) { }

  criar(dados: Reserva): Observable<any> {
    return this.http.post<any>(this.apiUrl, dados);
  }

  listar(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  obterPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  listarPorGato(gatoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/gato/${gatoId}`);
  }

  atualizarStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status });
  }

  deletar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
