import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GatoService } from '../../services/gato.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  gatoForm: FormGroup;
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
      observacoes: ['']
    });
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

  onSubmit() {
    if (this.gatoForm.valid && this.imagemFile) {
      this.carregando = true;
      
      // Criar FormData para enviar arquivo + dados
      const formData = new FormData();
      formData.append('nome', this.gatoForm.get('nome')?.value);
      formData.append('raca', this.gatoForm.get('raca')?.value);
      formData.append('sexo', this.gatoForm.get('sexo')?.value);
      formData.append('coloracao', this.gatoForm.get('coloracao')?.value);
      formData.append('observacoes', this.gatoForm.get('observacoes')?.value);
      formData.append('imagem', this.imagemFile);

      this.gatoService.criar(formData).subscribe({
        next: (response) => {
          if (response.sucesso) {
            this.mensagem = '😺 Animal cadastrado com sucesso!';
            this.tipoMensagem = 'sucesso';
            this.gatoForm.reset();
            this.imagemPreview = null;
            this.imagemFile = null;
          }
          this.carregando = false;
        },
        error: (err) => {
          this.mensagem = 'Erro ao cadastrar animal: ' + err.error?.erro || 'Erro desconhecido';
          this.tipoMensagem = 'erro';
          this.carregando = false;
        }
      });
    } else if (!this.imagemFile) {
      this.mensagem = 'Por favor, selecione uma imagem!';
      this.tipoMensagem = 'erro';
    } else {
      this.mensagem = 'Por favor, preencha todos os campos obrigatórios!';
      this.tipoMensagem = 'erro';
    }
  }
}

