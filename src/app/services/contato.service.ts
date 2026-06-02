import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contato {
  id?: number;
  raca: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  mensagem: string;
  status?: 'lido' | 'nao_lido';
  data_envio?: Date;
  ip_origem?: string;
}

export interface ListaContatosResponse {
  sucesso: boolean;
  dados: Contato[];
  contadores?: {
    total: number;
    naoLidos: number;
  };
}

export interface ContatoResponse {
  sucesso: boolean;
  mensagem?: string;
  dados?: Contato;
}

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  private apiUrl = 'http://localhost:3000/contatos';

  constructor(private http: HttpClient) {}

  /**
   * Criar novo contato
   */
  criar(contato: Contato): Observable<ContatoResponse> {
    return this.http.post<ContatoResponse>(this.apiUrl, contato);
  }

  /**
   * Listar todos os contatos com filtros opcionais
   */
  listar(status?: string, ordenar?: string): Observable<ListaContatosResponse> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (ordenar) {
      params = params.set('ordenar', ordenar);
    }
    return this.http.get<ListaContatosResponse>(this.apiUrl, { params });
  }

  /**
   * Obter um contato específico
   */
  obterPorId(id: number): Observable<ContatoResponse> {
    return this.http.get<ContatoResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Atualizar status de um contato
   */
  atualizarStatus(id: number, status: 'lido' | 'nao_lido'): Observable<ContatoResponse> {
    return this.http.put<ContatoResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Deletar um contato
   */
  deletar(id: number): Observable<ContatoResponse> {
    return this.http.delete<ContatoResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obter contadores
   */
  obterContadores(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/contadores`);
  }
}
