import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GatoService, Gato } from '../../services/gato.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  gatoForm: FormGroup;
  gatos: Gato[] = [];
  editando: boolean = false;
  gatoEditandoId: number | null = null;
  imagemPreview: string | ArrayBuffer | null = null;
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';
  carregando: boolean = false;
  imagemFile: File | null = null;

  constructor(private fb: FormBuilder, private gatoService: GatoService) {
    this.gatoForm = this.fb.group({
      nome: ['', Validators.required],
      raca: ['', Validators.required],
      sexo: ['', Validators.required],
      coloracao: ['', Validators.required],
      observacoes: [''],
      status: ['Disponível', Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarGatos();
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

  private construirFormData(): FormData {
    const formData = new FormData();
    formData.append('nome', this.gatoForm.get('nome')?.value);
    formData.append('raca', this.gatoForm.get('raca')?.value);
    formData.append('sexo', this.gatoForm.get('sexo')?.value);
    formData.append('coloracao', this.gatoForm.get('coloracao')?.value);
    formData.append('observacoes', this.gatoForm.get('observacoes')?.value || '');
    formData.append('status', this.gatoForm.get('status')?.value);

    if (this.imagemFile) {
      formData.append('imagem', this.imagemFile);
    }

    return formData;
  }

  private resetForm(): void {
    this.gatoForm.reset({ status: 'Disponível' });
    this.imagemPreview = null;
    this.imagemFile = null;
    this.editando = false;
    this.gatoEditandoId = null;
  }

  listarGatos(): void {
    this.carregando = true;
    this.gatoService.listar().subscribe({
      next: (resposta) => {
        this.gatos = resposta.dados || [];
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao listar gatos: ', err);
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
          this.mensagem = 'Erro ao atualizar o animal: ' + (err.error?.erro || 'Erro desconhecido');
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
          this.mensagem = 'Erro ao cadastrar animal: ' + (err.error?.erro || 'Erro desconhecido');
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
      status: gato.status || 'Disponível'
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
}

