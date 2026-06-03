import { Component, OnInit } from '@angular/core';
import { GaleriaItem, GaleriaService } from '../../services/galeria.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss']
})
export class GaleriaComponent implements OnInit {
  imagens: GaleriaItem[] = [];
  carregando = false;
  erro = '';

  constructor(private galeriaService: GaleriaService) { }

  ngOnInit(): void {
    this.carregarGaleria();
  }

  carregarGaleria(): void {
    this.carregando = true;
    this.erro = '';

    this.galeriaService.listar().subscribe({
      next: (resposta) => {
        this.imagens = resposta.dados || [];
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Não foi possível carregar as imagens da galeria. Tente novamente mais tarde.';
        console.error('Erro ao carregar galeria:', err);
        this.carregando = false;
      }
    });
  }

  trackByImagem(_: number, item: GaleriaItem): number | string {
    return item.id ?? item.url;
  }
}
