import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-resoconto-ordini',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './resoconto-ordini.component.html',
  styleUrls: ['./resoconto-ordini.component.css']
})
export class ResocontoOrdiniComponent implements OnInit {
  ordini: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('https://organic-fiesta-ww47g9v7p75hgwpg-3000.app.github.dev/resocontoOrdiniAccettati').subscribe({
      next: (data) => this.ordini = data,
      error: (err) => console.error('Errore nel recupero ordini', err)
    });
  }

  stampaFattura(ordine: any) {
    const doc = new jsPDF();

    const prodotti = ordine.prodotti || [];
    const data = prodotti.map((p: any) => {
      const prezzo = typeof p.prezzo === 'number' ? p.prezzo : parseFloat(p.prezzo) || 0;
      const totale = prezzo * p.quantita;
      return [
        p.nome,
        `${p.quantita}x`,
        `${prezzo.toFixed(2)} €`,
        `${totale.toFixed(2)} €`
      ];
    });

    const totaleOrdine = prodotti.reduce((sum: number, p: any) => {
      const prezzo = typeof p.prezzo === 'number' ? p.prezzo : parseFloat(p.prezzo) || 0;
      return sum + (prezzo * p.quantita);
    }, 0);

    // Caricamento del logo
    const logoUrl = 'assets/Logo1.png'; 
    const logoWidth = 40;  // Larghezza del logo
    const logoHeight = 40; // Altezza del logo

    // Calcola la posizione X per centrare il logo a destra
    const pageWidth = doc.internal.pageSize.width; // Larghezza della pagina
    const logoX = pageWidth - logoWidth - 15; // Posizione X del logo (10mm da destra)

    // Aggiungi il logo al documento
    doc.addImage(logoUrl, 'PNG', logoX, 10, logoWidth, logoHeight); // 10 è la posizione Y

    doc.setFontSize(16);
    doc.text("Fattura Ordine", 15, 20);

    doc.setFontSize(12);
    doc.text(`Email: ${ordine.email}`, 15, 36);
    doc.text(`Data Ordine: ${new Date(ordine.creatoIl).toLocaleString()}`, 15, 42);

    // Ora autoTable dovrebbe essere correttamente riconosciuto
    autoTable(doc, {
      head: [['Prodotto', 'Quantità', 'Prezzo Unitario', 'Totale']],
      body: data,
      startY: 50
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 60;

    doc.setFontSize(14);
    doc.text(`Totale: ${totaleOrdine.toFixed(2)} €`, 15, finalY + 10);

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const win = window.open(url);
    if (win) {
      win.onload = () => {
        win.focus();
        win.print();
      };
    }
  }
}
