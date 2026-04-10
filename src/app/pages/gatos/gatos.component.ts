import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { GatoService, Gato } from '../../services/gato.service';
import { NinhadaService, Ninhada } from '../../services/ninhada.service';

@Component({
  selector: 'app-gatos',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './gatos.component.html',
  styleUrl: './gatos.component.scss'
})
export class GatosComponent implements OnInit {
  matrizes: Gato[] = [];
  padreadores: Gato[] = [];
  ninhadas: Ninhada[] = [];

  constructor(private gatoService: GatoService, private ninhadaService: NinhadaService) {}

  ngOnInit(): void {
    this.carregarGatos();
    this.carregarNinhadas();
  }

  carregarGatos(): void {
    this.gatoService.listar().subscribe({
      next: (resposta) => {
        const gatos = resposta.dados || [];
        const gatosAdultos = gatos.filter((g: Gato) => g.tipo === 'gato');
        this.matrizes = gatosAdultos.filter((g: Gato) => g.sexo === 'Fêmea');
        this.padreadores = gatosAdultos.filter((g: Gato) => g.sexo === 'Macho');
      },
      error: (err) => console.error('Erro ao carregar gatos:', err)
    });
  }

  carregarNinhadas(): void {
    this.ninhadaService.listar().subscribe({
      next: (ninhadas: Ninhada[]) => {
        this.ninhadas = ninhadas;
      },
      error: (err) => console.error('Erro ao carregar ninhadas:', err)
    });
  }

  getGatoNome(id: number): string {
    const todosGatos = [...this.matrizes, ...this.padreadores];
    const gato = todosGatos.find(g => g.id === id);
    return gato ? gato.nome : 'Desconhecido';
  }
}
