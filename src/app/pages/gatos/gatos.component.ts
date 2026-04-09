import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { GatoService, Gato } from '../../services/gato.service';

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

  constructor(private gatoService: GatoService) {}

  ngOnInit(): void {
    this.carregarGatos();
  }

  carregarGatos(): void {
    this.gatoService.listar().subscribe({
      next: (gatos: Gato[]) => {
        this.matrizes = gatos.filter(g => g.sexo === 'Fêmea');
        this.padreadores = gatos.filter(g => g.sexo === 'Macho');
      },
      error: (err) => console.error('Erro ao carregar gatos:', err)
    });
  }

  calcularIdade(dataNascimento: string | undefined): string {
    if (!dataNascimento) return 'Desconhecida';
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    const diff = hoje.getTime() - nascimento.getTime();
    const anos = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return anos + ' anos';
  }
}
