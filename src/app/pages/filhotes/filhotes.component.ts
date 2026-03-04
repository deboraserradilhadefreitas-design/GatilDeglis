import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GatoService, Gato } from '../../services/gato.service';

@Component({
  selector: 'app-filhotes',
  templateUrl: './filhotes.component.html',
  styleUrl: './filhotes.component.scss'
})
export class FilhotesComponent implements OnInit {
  formulario!: FormGroup;
  gatos: Gato[] = [];
  mensagem: string = '';
  mensagemTipo: 'sucesso' | 'erro' | '' = '';
  carregando: boolean = false;
  mostraFormulario: boolean = false;

  constructor(
    private fb: FormBuilder,
    private gatoService: GatoService
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.listarGatos();
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      raca: ['', [Validators.required, Validators.minLength(2)]],
      sexo: ['', Validators.required],
      coloracao: ['', [Validators.required, Validators.minLength(2)]],
      observacoes: ['']
    });
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      this.carregando = true;
      const dadosGato: Gato = this.formulario.value;

      this.gatoService.criar(dadosGato).subscribe({
        next: (resposta) => {
          this.mensagem = resposta.mensagem || 'Gato cadastrado com sucesso!';
          this.mensagemTipo = 'sucesso';
          this.formulario.reset();
          this.mostraFormulario = false;
          this.carregando = false;
          this.listarGatos();

          // Limpar mensagem após 3 segundos
          setTimeout(() => {
            this.mensagem = '';
            this.mensagemTipo = '';
          }, 3000);
        },
        error: (erro) => {
          this.mensagem = erro.error?.erro || 'Erro ao cadastrar gato!';
          this.mensagemTipo = 'erro';
          this.carregando = false;

          // Limpar mensagem após 3 segundos
          setTimeout(() => {
            this.mensagem = '';
            this.mensagemTipo = '';
          }, 3000);
        }
      });
    }
  }

  listarGatos() {
    this.gatoService.listar().subscribe({
      next: (resposta) => {
        this.gatos = resposta.dados || [];
      },
      error: (erro) => {
        console.error('Erro ao listar gatos:', erro);
      }
    });
  }

  deletarGato(id: number | undefined) {
    if (id && confirm('Tem certeza que deseja deletar este gato?')) {
      this.gatoService.deletar(id).subscribe({
        next: () => {
          this.mensagem = 'Gato deletado com sucesso!';
          this.mensagemTipo = 'sucesso';
          this.listarGatos();

          setTimeout(() => {
            this.mensagem = '';
            this.mensagemTipo = '';
          }, 3000);
        },
        error: (erro) => {
          this.mensagem = erro.error?.erro || 'Erro ao deletar gato!';
          this.mensagemTipo = 'erro';

          setTimeout(() => {
            this.mensagem = '';
            this.mensagemTipo = '';
          }, 3000);
        }
      });
    }
  }

  toggleFormulario() {
    this.mostraFormulario = !this.mostraFormulario;
    if (!this.mostraFormulario) {
      this.formulario.reset();
    }
  }
}

