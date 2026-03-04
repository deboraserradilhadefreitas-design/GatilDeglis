import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Gato {
  id?: number;
  nome: string;
  raca: string;
  sexo: 'Macho' | 'Fêmea';
  coloracao: string;
  observacoes?: string;
  imagem?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GatoService {
  private apiUrl = `${environment.apiUrl}/gatos`;

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
