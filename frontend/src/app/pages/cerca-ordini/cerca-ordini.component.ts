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
  totaleOrdine: number = 0;
  devices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | null = null;

  formatsEnabled = [BarcodeFormat.QR_CODE];

  constructor(private http: HttpClient) {}

  cercaOrdine() {
    if (!this.ordineId.trim()) return;

    this.http.get<any>(`http://109.123.240.145:4000/ordini/id/${this.ordineId}`).subscribe({
      next: (res) => {
        this.ordine = res;
        this.noResults = !res;

        // Calcolo del totale
        this.totaleOrdine = 0;
        if (res && res.prodotti && Array.isArray(res.prodotti)) {
          this.totaleOrdine = res.prodotti.reduce((sum: number, p: any) => {
            return sum + (p.prezzo || 0) * (p.quantita || 0);
          }, 0);
        }
      },
      error: () => {
        this.ordine = null;
        this.noResults = true;
        this.totaleOrdine = 0;
      }
    });
  }

  onCodeResult(result: string) {
    this.ordineId = result;
    this.cercaOrdine();
  }

  confermaRitiro() {
    if (!this.ordineId) return;

    this.http.post<any>(
      `http://109.123.240.145:4000/ordini/conferma-ritiro`,
      { ordineId: this.ordineId }
    ).subscribe({
      next: () => {
        alert('Ritiro confermato con successo!');

      },
      error: () => {
        alert('Errore durante la conferma del ritiro.');
      }
    });
  }

  onCamerasFound(devices: MediaDeviceInfo[]) {
  this.devices = devices;
  if (devices.length > 0) {
    this.currentDevice = devices[0]; // seleziona la prima cam trovata
  }
}

onPermissionResponse(hasPermission: boolean) {
  if (!hasPermission) {
    alert('Permesso alla videocamera negato.');
  }
}
}
