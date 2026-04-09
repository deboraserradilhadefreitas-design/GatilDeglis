import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Ninhada {
  id?: number;
  nome: string;
  imagem?: string;
  pai_id: number;
  mae_id: number;
  quantidade_filhotes: number;
}

@Injectable({
  providedIn: 'root'
})
export class NinhadaService {
  private apiUrl = `${environment.apiUrl}/ninhadas`;

  constructor(private http: HttpClient) { }

  criar(dados: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dados);
  }

  listar(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  obterPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dados);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}