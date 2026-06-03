import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GaleriaItem {
  id?: number;
  url: string;
  legenda?: string | null;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GaleriaService {
  private apiUrl = `${environment.apiUrl}/galeria`;

  constructor(private http: HttpClient) { }

  listar(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  criar(dados: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dados);
  }

  atualizarLegenda(id: number, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dados);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
