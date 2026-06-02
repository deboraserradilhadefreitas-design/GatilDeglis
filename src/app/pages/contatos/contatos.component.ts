import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { ContatoService } from '../../services/contato.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.scss']
})
export class ContatosComponent implements OnInit, OnDestroy {
  form: FormGroup;
  cidades: string[] = [];
  racas: string[] = ['Ragdoll', 'American Curl', 'Maine Coon', 'Siamês', 'Persa', 'Sphynx'];
  
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';
  enviando: boolean = false;
  
  private destroy$ = new Subject<void>();
  private ultimoEnvio: number = 0;
  private intervaloMinimo: number = 3000; // 3 segundos entre envios

  constructor(
    private serviceUtils: UtilsService,
    private contatoService: ContatoService
  ) {
    this.form = new FormGroup({
      raca: new FormControl('', [Validators.required]),
      nome: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)+$/)
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\(\d{2}\)\s?9?\d{4}-\d{4}$|^\d{10,11}$/)
      ]),
      cidade: new FormControl('', [Validators.required]),
      mensagem: new FormControl('', [
        Validators.required,
        Validators.maxLength(500)
      ])
    });
  }

  ngOnInit(): void {
    this.carregarCidades();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carrega lista de cidades do serviço utils
   */
  private carregarCidades(): void {
    this.serviceUtils.getCidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cidades = data.map((cidade: any) => cidade.nome);
        },
        error: (err) => {
          console.error('Erro ao carregar cidades:', err);
          this.exibirMensagem('Erro ao carregar cidades', 'erro');
        }
      });
  }

  /**
   * Formata o número de telefone enquanto o usuário digita
   */
  formatarTelefone(): void {
    const telefoneControl = this.form.get('telefone');
    if (telefoneControl) {
      let valor = telefoneControl.value;
      
      // Remove caracteres não numéricos
      valor = valor.replace(/\D/g, '');
      
      // Formata de acordo com o tamanho
      if (valor.length === 10) {
        valor = valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else if (valor.length === 11) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (valor.length > 0) {
        valor = valor.substring(0, 11);
      }
      
      telefoneControl.setValue(valor, { emitEvent: false });
    }
  }

  /**
   * Submete o formulário
   */
  onSubmit(): void {
    // Validações adicionais
    if (!this.form.valid) {
      this.exibirMensagem('Por favor, preencha todos os campos corretamente', 'erro');
      return;
    }

    // Previne envios duplicados
    const agora = Date.now();
    if (agora - this.ultimoEnvio < this.intervaloMinimo) {
      this.exibirMensagem('Aguarde alguns segundos antes de enviar outra mensagem', 'erro');
      return;
    }

    this.enviando = true;
    this.ultimoEnvio = agora;

    // Prepara dados para envio
    const dados = {
      raca: this.form.get('raca')?.value,
      nome: this.form.get('nome')?.value.trim(),
      email: this.form.get('email')?.value.trim(),
      telefone: this.form.get('telefone')?.value.replace(/\D/g, ''),
      cidade: this.form.get('cidade')?.value,
      mensagem: this.form.get('mensagem')?.value.trim()
    };

    // Envia para o servidor
    this.contatoService.criar(dados)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resposta) => {
          this.enviando = false;
          
          if (resposta.sucesso) {
            this.exibirMensagem(
              'Obrigado! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.',
              'sucesso'
            );
            this.resetarForm();
            
            // Recarregar página após 3 segundos
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } else {
            this.exibirMensagem('Erro ao enviar mensagem', 'erro');
          }
        },
        error: (err) => {
          this.enviando = false;
          console.error('Erro ao enviar contato:', err);
          
          let mensagemErro = 'Erro ao enviar mensagem. Tente novamente.';
          if (err.error && err.error.erro) {
            mensagemErro = err.error.erro;
          }
          
          this.exibirMensagem(mensagemErro, 'erro');
        }
      });
  }

  /**
   * Reseta o formulário
   */
  resetarForm(): void {
    this.form.reset({
      raca: '',
      nome: '',
      email: '',
      telefone: '',
      cidade: '',
      mensagem: ''
    });
  }

  /**
   * Getter para acessar campos do formulário
   */
  get fields() {
    return {
      raca: this.form.get('raca'),
      nome: this.form.get('nome'),
      email: this.form.get('email'),
      telefone: this.form.get('telefone'),
      cidade: this.form.get('cidade'),
      mensagem: this.form.get('mensagem')
    };
  }

  /**
   * Exibe mensagem de feedback
   */
  private exibirMensagem(msg: string, tipo: 'sucesso' | 'erro'): void {
    this.mensagem = msg;
    this.tipoMensagem = tipo;
    
    setTimeout(() => {
      this.mensagem = '';
    }, 5000);
  }
}





  // ! ESTUDOS !

  // ngOnInit(): void {
  //   this.fazerLigacao();
  // }



  // fazerLigacao(){
    

    // let numero = this.pegarNumero();

    // console.log(numero)
    
    // console.log("seu telefone é: ", this.telefone)
  // }


  // pegarNumero(){
  //   let numero = 12345;

  //   return numero;
  // }


  // fazerPedido(){
  //   console.log("seu telefone é: ", this.telefone)
  // }



