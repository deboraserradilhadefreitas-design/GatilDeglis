import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GatoService, Gato } from '../../services/gato.service';
import { NinhadaService, Ninhada } from '../../services/ninhada.service';
import { ReservaService, Reserva } from '../../services/reserva.service';
import { ContatoService, Contato } from '../../services/contato.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  gatoForm: FormGroup;
  ninhadaForm: FormGroup;
  gatos: Gato[] = [];
  ninhadas: Ninhada[] = [];
  reservas: Reserva[] = [];
  gatosReservados: Gato[] = [];
  machos: Gato[] = [];
  femeas: Gato[] = [];
  contatos: Contato[] = [];
  contatosContadores: any = {};
  contatosFiltrados: Contato[] = [];
  filtroContatoStatus: string = '';
  editando: boolean = false;
  gatoEditandoId: number | null = null;
  editandoNinhada: boolean = false;
  ninhadaEditandoId: number | null = null;
  imagemPreview: string | ArrayBuffer | null = null;
  imagemNinhadaPreview: string | ArrayBuffer | null = null;
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';
  carregando: boolean = false;
  imagemFile: File | null = null;
  imagemNinhadaFile: File | null = null;

  racas: string[] = ['Ragdoll', 'American Curl', 'Maine Coon', 'Siamês', 'Persa', 'Sphynx'];

  constructor(
    private fb: FormBuilder,
    private gatoService: GatoService,
    private ninhadaService: NinhadaService,
    private reservaService: ReservaService,
    private contatoService: ContatoService
  ) {
    this.gatoForm = this.fb.group({
      nome: ['', Validators.required],
      raca: ['', Validators.required],
      sexo: ['', Validators.required],
      coloracao: ['', Validators.required],
      observacoes: [''],
      status: [''],
      idade: ['', [Validators.min(0), Validators.max(30)]],
      tipo: ['gato', Validators.required]
    });
    this.ninhadaForm = this.fb.group({
      nome: ['', Validators.required],
      pai_id: ['', Validators.required],
      mae_id: ['', Validators.required],
      quantidade_filhotes: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.listarGatos();
    this.listarNinhadas();
    this.listarReservas();
    this.listarGatosReservados();
    this.listarContatos();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagemFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagemPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileChangeNinhada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagemNinhadaFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagemNinhadaPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private construirFormData(): FormData {
    const formData = new FormData();
    const tipo = this.gatoForm.get('tipo')?.value;
    const idade = this.gatoForm.get('idade')?.value;
    const status = this.gatoForm.get('status')?.value;
    
    console.log('=== CONSTRUINDO FORMDATA ===');
    console.log('Tipo (raw):', tipo, 'Type:', typeof tipo);
    console.log('Idade (raw):', idade, 'Type:', typeof idade);
    console.log('Status (raw):', status, 'Type:', typeof status);
    
    formData.append('nome', this.gatoForm.get('nome')?.value);
    formData.append('raca', this.gatoForm.get('raca')?.value);
    formData.append('sexo', this.gatoForm.get('sexo')?.value);
    formData.append('coloracao', this.gatoForm.get('coloracao')?.value);
    formData.append('observacoes', this.gatoForm.get('observacoes')?.value || '');
    
    // Status é opcional
    if (status !== null && status !== undefined && status !== '') {
      formData.append('status', status);
    }
    
    // Tipo é obrigatório - sempre enviar
    const tipoEnvio = tipo && tipo.length > 0 ? tipo : 'gato';
    formData.append('tipo', tipoEnvio);
    console.log('Tipo sendo enviado:', tipoEnvio);
    
    // Idade é opcional
    if (idade !== null && idade !== undefined && idade !== '') {
      formData.append('idade', idade.toString());
    }

    if (this.imagemFile) {
      formData.append('imagem', this.imagemFile);
    }


    return formData;
  }

  private resetForm(): void {
    this.gatoForm.reset({ status: '', tipo: 'gato' });
    this.imagemPreview = null;
    this.imagemFile = null;
    this.editando = false;
    this.gatoEditandoId = null;
  }

  private resetFormNinhada(): void {
    this.ninhadaForm.reset();
    this.imagemNinhadaPreview = null;
    this.imagemNinhadaFile = null;
    this.editandoNinhada = false;
    this.ninhadaEditandoId = null;
  }

  listarGatos(): void {
    this.carregando = true;
    this.gatoService.listar().subscribe({
      next: (resposta) => {
        this.gatos = resposta.dados || [];
        this.machos = this.gatos.filter((g: Gato) => g.sexo === 'Macho');
        this.femeas = this.gatos.filter((g: Gato) => g.sexo === 'Fêmea');
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao listar gatos: ', err);
        this.carregando = false;
      }
    });
  }

  listarGatosReservados(): void {
    this.carregando = true;
    this.gatoService.listarReservados().subscribe({
      next: (resposta) => {
        this.gatosReservados = resposta.dados || [];
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao listar gatos reservados: ', err);
        this.carregando = false;
      }
    });
  }

  onSubmit() {
    if (!this.gatoForm.valid) {
      this.mensagem = 'Por favor, preencha todos os campos obrigatórios!';
      this.tipoMensagem = 'erro';
      return;
    }

    if (!this.editando && !this.imagemFile) {
      this.mensagem = 'Por favor, selecione uma imagem!';
      this.tipoMensagem = 'erro';
      return;
    }

    this.carregando = true;
    const formData = this.construirFormData();

    if (this.editando && this.gatoEditandoId !== null) {
      this.gatoService.atualizar(this.gatoEditandoId, formData).subscribe({
        next: (response) => {
          this.mensagem = '😺 Animal atualizado com sucesso!';
          this.tipoMensagem = 'sucesso';
          this.resetForm();
          this.listarGatos();
          this.carregando = false;
        },
        error: (err) => {
          const status = err.status || 0;
          const detalheErro = err.error?.erro || err.error?.message || err.message || 'Erro desconhecido';
          this.mensagem = `Erro ao atualizar o animal (status ${status}): ${detalheErro}`;
          this.tipoMensagem = 'erro';
          this.carregando = false;
        }
      });
    } else {
      this.gatoService.criar(formData).subscribe({
        next: (response) => {
          this.mensagem = '😺 Animal cadastrado com sucesso!';
          this.tipoMensagem = 'sucesso';
          this.resetForm();
          this.listarGatos();
          this.carregando = false;
        },
        error: (err) => {
          const status = err.status || 0;
          const detalheErro = err.error?.erro || err.error?.message || err.message || 'Erro desconhecido';
          this.mensagem = `Erro ao cadastrar animal (status ${status}): ${detalheErro}`;
          this.tipoMensagem = 'erro';
          this.carregando = false;
        }
      });
    }
  }

  editarGato(gato: Gato): void {
    this.editando = true;
    this.gatoEditandoId = gato.id ?? null;
    this.gatoForm.patchValue({
      nome: gato.nome,
      raca: gato.raca,
      sexo: gato.sexo,
      coloracao: gato.coloracao,
      observacoes: gato.observacoes || '',
      status: gato.status || '',
      idade: gato.idade || '',
      tipo: gato.tipo || 'gato'
    });

    this.imagemPreview = gato.imagem || null;
    this.mensagem = 'Modo edição ativado. Altere os dados e salve.';
    this.tipoMensagem = 'sucesso';
  }

  cancelarEdicao(): void {
    this.resetForm();
    this.mensagem = '';
  }

  deletarGato(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este cadastro?')) {
      return;
    }

    this.carregando = true;
    this.gatoService.deletar(id).subscribe({
      next: () => {
        this.mensagem = '🗑️ Cadastro excluído com sucesso!';
        this.tipoMensagem = 'sucesso';
        this.listarGatos();
        this.carregando = false;
      },
      error: (err) => {
        this.mensagem = 'Erro ao excluir cadastro: ' + (err.error?.erro || 'Erro desconhecido');
        this.tipoMensagem = 'erro';
        this.carregando = false;
      }
    });
  }

  getGatoNome(id: number): string {
    const gato = this.gatos.find(g => g.id === id);
    return gato ? gato.nome : 'Desconhecido';
  }

  calcularIdade(idade: number | undefined): string {
    return idade ? idade + ' anos' : '—';
  }

  listarNinhadas(): void {
    this.ninhadaService.listar().subscribe({
      next: (resposta) => {
        this.ninhadas = resposta;
      },
      error: (err) => {
        console.error('Erro ao listar ninhadas: ', err);
      }
    });
  }

  editarNinhada(ninhada: Ninhada): void {
    this.editandoNinhada = true;
    this.ninhadaEditandoId = ninhada.id ?? null;
    this.ninhadaForm.patchValue({
      nome: ninhada.nome,
      pai_id: ninhada.pai_id,
      mae_id: ninhada.mae_id,
      quantidade_filhotes: ninhada.quantidade_filhotes
    });

    this.imagemNinhadaPreview = ninhada.imagem || null;
    this.mensagem = 'Modo edição ativado. Altere os dados e salve.';
    this.tipoMensagem = 'sucesso';
  }

  cancelarEdicaoNinhada(): void {
    this.resetFormNinhada();
    this.mensagem = '';
  }

  deletarNinhada(id: number): void {
    if (!confirm('Tem certeza que deseja excluir esta ninhada?')) {
      return;
    }

    this.carregando = true;
    this.ninhadaService.deletar(id).subscribe({
      next: () => {
        this.mensagem = '🗑️ Ninhada excluída com sucesso!';
        this.tipoMensagem = 'sucesso';
        this.listarNinhadas();
        this.carregando = false;
      },
      error: (err) => {
        this.mensagem = 'Erro ao excluir ninhada: ' + (err.error?.erro || 'Erro desconhecido');
        this.tipoMensagem = 'erro';
        this.carregando = false;
      }
    });
  }

  onSubmitNinhada() {
    if (!this.ninhadaForm.valid) {
      this.mensagem = 'Por favor, preencha todos os campos obrigatórios!';
      this.tipoMensagem = 'erro';
      return;
    }

    this.carregando = true;
    const formData = new FormData();
    
    formData.append('nome', this.ninhadaForm.get('nome')?.value);
    formData.append('pai_id', this.ninhadaForm.get('pai_id')?.value);
    formData.append('mae_id', this.ninhadaForm.get('mae_id')?.value);
    formData.append('quantidade_filhotes', this.ninhadaForm.get('quantidade_filhotes')?.value);

    if (this.imagemNinhadaFile) {
      formData.append('imagem', this.imagemNinhadaFile);
    }

    if (this.editandoNinhada && this.ninhadaEditandoId !== null) {
      this.ninhadaService.atualizar(this.ninhadaEditandoId, formData).subscribe({
        next: (response) => {
          this.mensagem = '🐾 Ninhada atualizada com sucesso!';
          this.tipoMensagem = 'sucesso';
          this.resetFormNinhada();
          this.listarNinhadas();
          this.carregando = false;
        },
        error: (err) => {
          const status = err.status || 0;
          const detalheErro = err.error?.erro || err.error?.message || err.message || 'Erro desconhecido';
          this.mensagem = `Erro ao atualizar ninhada (status ${status}): ${detalheErro}`;
          this.tipoMensagem = 'erro';
          this.carregando = false;
        }
      });
    } else {
      this.ninhadaService.criar(formData).subscribe({
        next: (response) => {
          this.mensagem = '🐾 Ninhada cadastrada com sucesso!';
          this.tipoMensagem = 'sucesso';
          this.resetFormNinhada();
          this.listarNinhadas();
          this.carregando = false;
        },
        error: (err) => {
          const status = err.status || 0;
          const detalheErro = err.error?.erro || err.error?.message || err.message || 'Erro desconhecido';
          this.mensagem = `Erro ao cadastrar ninhada (status ${status}): ${detalheErro}`;
          this.tipoMensagem = 'erro';
          this.carregando = false;
        }
      });
    }
  }

  // ===== MÉTODOS DE RESERVAS =====
  
  listarReservas(): void {
    this.reservaService.listar().subscribe({
      next: (resposta) => {
        this.reservas = resposta.dados || [];
      },
      error: (err) => {
        console.error('Erro ao listar reservas: ', err);
      }
    });
  }

  obterNomeGato(gatoId: number): string {
    const reserva = this.reservas.find(r => r.id === gatoId);
    if (reserva && reserva.Gato) {
      return reserva.Gato.nome;
    }
    return 'Desconhecido';
  }

  formatarData(data: any): string {
    if (!data) return '—';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  obterWhatsAppLink(telefone: string): string {
    const apenasNumeros = telefone.replace(/\D/g, '');
    return `https://wa.me/${apenasNumeros}`;
  }

  deletarReserva(id: number): void {
    if (!confirm('Tem certeza que deseja deletar esta reserva?')) {
      return;
    }

    this.carregando = true;
    this.reservaService.deletar(id).subscribe({
      next: () => {
        this.mensagem = '🗑️ Reserva deletada com sucesso!';
        this.tipoMensagem = 'sucesso';
        this.listarReservas();
        this.carregando = false;
      },
      error: (err) => {
        this.mensagem = 'Erro ao deletar reserva: ' + (err.error?.erro || 'Erro desconhecido');
        this.tipoMensagem = 'erro';
        this.carregando = false;
      }
    });
  }

  // ===== MÉTODOS DE CONTATOS =====

  listarContatos(): void {
    this.carregando = true;
    this.contatoService.listar(this.filtroContatoStatus || undefined).subscribe({
      next: (resposta) => {
        this.contatos = resposta.dados || [];
        this.contatosFiltrados = this.contatos;
        this.contatosContadores = resposta.contadores || { total: 0, naoLidos: 0 };
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao listar contatos: ', err);
        this.mensagem = 'Erro ao carregar contatos: ' + (err.error?.erro || 'Erro desconhecido');
        this.tipoMensagem = 'erro';
        this.carregando = false;
      }
    });
  }

  filtrarContatos(status: string): void {
    this.filtroContatoStatus = status;
    this.listarContatos();
  }

  alternarStatusContato(id: number, statusAtual: string): void {
    const novoStatus = statusAtual === 'nao_lido' ? 'lido' : 'nao_lido';
    
    this.carregando = true;
    this.contatoService.atualizarStatus(id, novoStatus).subscribe({
      next: () => {
        this.mensagem = 'Status atualizado com sucesso!';
        this.tipoMensagem = 'sucesso';
        this.listarContatos();
        this.carregando = false;
      },
      error: (err) => {
        this.mensagem = 'Erro ao atualizar status: ' + (err.error?.erro || 'Erro desconhecido');
        this.tipoMensagem = 'erro';
        this.carregando = false;
      }
    });
  }

  deletarContato(id: number): void {
    if (!confirm('Tem certeza que deseja deletar este contato?')) {
      return;
    }

    this.carregando = true;
    this.contatoService.deletar(id).subscribe({
      next: () => {
        this.mensagem = '🗑️ Contato deletado com sucesso!';
        this.tipoMensagem = 'sucesso';
        this.listarContatos();
        this.carregando = false;
      },
      error: (err) => {
        this.mensagem = 'Erro ao deletar contato: ' + (err.error?.erro || 'Erro desconhecido');
        this.tipoMensagem = 'erro';
        this.carregando = false;
      }
    });
  }

  formatarTelefone(telefone: string): string {
    if (!telefone) return '—';
    const apenasNumeros = telefone.replace(/\D/g, '');
    if (apenasNumeros.length === 10) {
      return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (apenasNumeros.length === 11) {
      return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  }
}

