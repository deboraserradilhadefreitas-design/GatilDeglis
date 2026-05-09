import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Gato } from '../../../services/gato.service';

@Component({
  selector: 'app-reserva-modal',
  templateUrl: './reserva-modal.component.html',
  styleUrl: './reserva-modal.component.scss'
})
export class ReservaModalComponent implements OnInit {
  reservaForm: FormGroup;
  gato: Gato;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReservaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { gato: Gato }
  ) {
    this.gato = data.gato;
    this.reservaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.minLength(10)]],
      observacoes: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.reservaForm.valid) {
      this.dialogRef.close(this.reservaForm.value);
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  get nome() {
    return this.reservaForm.get('nome');
  }

  get email() {
    return this.reservaForm.get('email');
  }

  get telefone() {
    return this.reservaForm.get('telefone');
  }
}
