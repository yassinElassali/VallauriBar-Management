import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-cerca-ordini',
  standalone: true,
  imports: [CommonModule, FormsModule, ZXingScannerModule],
  templateUrl: './cerca-ordini.component.html',
  styleUrls: ['./cerca-ordini.component.css']
})
export class CercaOrdiniComponent {
  ordineId: string = '';
  ordine: any = null;
  noResults: boolean = false;

  formatsEnabled = [BarcodeFormat.QR_CODE];

  constructor(private http: HttpClient) {}

  cercaOrdine() {
    if (!this.ordineId.trim()) return;

    this.http.get<any>(`https://organic-fiesta-ww47g9v7p75hgwpg-3000.app.github.dev/ordini/id/${this.ordineId}`).subscribe({
      next: (res) => {
        this.ordine = res;
        this.noResults = !res;
      },
      error: () => {
        this.ordine = null;
        this.noResults = true;
      }
    });
  }

  onCodeResult(result: string) {
    this.ordineId = result;
    this.cercaOrdine();
  }
}
