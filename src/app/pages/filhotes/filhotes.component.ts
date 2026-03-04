import { Component, OnInit } from '@angular/core';
import { GatoService, Gato } from '../../services/gato.service';

@Component({
  selector: 'app-filhotes',
  templateUrl: './filhotes.component.html',
  styleUrl: './filhotes.component.scss'
})
export class FilhotesComponent implements OnInit {
  gatos: Gato[] = [];
  carregando: boolean = true;

  constructor(private gatoService: GatoService) {}

  ngOnInit() {
    this.listarGatos();
  }

  listarGatos() {
    this.carregando = true;
    this.gatoService.listar().subscribe({
      next: (resposta) => {
        this.gatos = resposta.dados || [];
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao listar gatos:', erro);
        this.carregando = false;
      }
    });
  }
}

