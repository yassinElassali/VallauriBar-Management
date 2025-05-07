import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {
  constructor(private router: Router) {}

    pin: string = '';
    numbers: number[] = [1,2,3,4,5,6,7,8,9,0];
  
    get pinDisplay(): string {
      return '*'.repeat(this.pin.length);
    }
  
    addDigit(digit: number): void {
      if (this.pin.length < 4) {
        this.pin += digit;
        if (this.pin.length === 4) {
          this.checkPin();
        }
      }
    }
  
    resetPin(): void {
      this.pin = '';
    }
  
    checkPin(): void {
      if (this.pin === '1234') {
        this.router.navigate(['/dashboard']);
      } else {
        alert('PIN errato');
        this.resetPin();
      }
    }
}
