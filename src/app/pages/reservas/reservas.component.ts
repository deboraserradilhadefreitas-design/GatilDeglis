import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GatoService, Gato } from '../../services/gato.service';
import { ReservaService, Reserva } from '../../services/reserva.service';
import { ReservaModalComponent } from './reserva-modal/reserva-modal.component';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.scss'
})
export class ReservasComponent implements OnInit {
  filhotes: Gato[] = [];
  carregando: boolean = false;
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';

  constructor(
    private gatoService: GatoService,
    private reservaService: ReservaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.listarFilhotes();
  }

  listarFilhotes(): void {
    this.carregando = true;
    this.gatoService.listar().subscribe({
      next: (resposta) => {
        // Filtrar apenas filhotes disponíveis
        const todos = resposta.dados || [];
        this.filhotes = todos.filter((gato: Gato) => 
          gato.tipo === 'filhote' && gato.status !== 'Vendido'
        );
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao listar filhotes:', err);
        this.exibirMensagem('Erro ao carregar filhotes', 'erro');
        this.carregando = false;
      }
    });
  }

  abrirModalReserva(gato: Gato): void {
    const dialogRef = this.dialog.open(ReservaModalComponent, {
      width: '600px',
      data: { gato }
    });

    dialogRef.afterClosed().subscribe((resultado: any) => {
      if (resultado) {
        this.criarReserva(resultado, gato);
      }
    });
  }

  private criarReserva(dados: any, gato: Gato): void {
    this.carregando = true;
    const reserva: Reserva = {
      gato_id: gato.id || 0,
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      observacoes: dados.observacoes
    };

    this.reservaService.criar(reserva).subscribe({
      next: (resposta) => {
        this.carregando = false;
        this.exibirMensagem('Reserva realizada com sucesso! Entraremos em contato em breve.', 'sucesso');
        // Recarregar lista após 2 segundos
        setTimeout(() => {
          this.listarFilhotes();
        }, 2000);
      },
      error: (err) => {
        console.error('Erro ao criar reserva:', err);
        this.carregando = false;
        this.exibirMensagem('Erro ao realizar reserva. Tente novamente.', 'erro');
      }
    });
  }

  private exibirMensagem(msg: string, tipo: 'sucesso' | 'erro'): void {
    this.mensagem = msg;
    this.tipoMensagem = tipo;
    setTimeout(() => {
      this.mensagem = '';
    }, 4000);
  }
}
