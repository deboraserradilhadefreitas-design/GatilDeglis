import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  gatoForm: FormGroup; // Cria o formulário reativo
  imagemPreview: string | ArrayBuffer | null = null; // Para mostrar o preview da imagem




  constructor(private fb: FormBuilder) {
    // Inicializa o formulário com os campos e validações

    this.gatoForm = this.fb.group({
      nome: ['', Validators.required], // Campo obrigatório
      idade: ['', Validators.required], 
      raca: ['', Validators.required], 
      sexo: ['', Validators.required], 
      coloracao: ['', Validators.required], 
      observacoes: [''], // Opcional
      imagem: [null, Validators.required] // Campo obrigatório (arquivo)
    });
  }



  // Quando o usuário escolhe um arquivo (imagem)

  onFileChange(event: any) {
    const file = event.target.files[0];     // Pega o primeiro arquivo enviado
    if (file) {
      this.gatoForm.patchValue({ imagem: file }); // Atualiza o campo 'imagem' no formulário

      const reader = new FileReader();    // Cria um leitor de arquivos
      reader.onload = () => {
        this.imagemPreview = reader.result; // Guarda a imagem em base64 pra mostrar no preview
      };
      reader.readAsDataURL(file); // Lê o arquivo como URL base64
    }
  }




  // Quando o formulário é enviado

  onSubmit() {
    if (this.gatoForm.valid) {
      console.log(this.gatoForm.value); // Mostra os dados no console
      alert('Gatinho cadastrado com sucesso!');
      this.gatoForm.reset(); // Limpa o formulário
      this.imagemPreview = null; // Remove o preview
    } else {
      alert('Preencha todos os campos obrigatórios!');
    }
  }
}

