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
    this.http.get<any[]>('https://management.vallauribar.connectify.it/api/resocontoOrdiniAccettati').subscribe({
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

  // Logo
  const logoUrl = 'assets/Logo1.png';
  const logoWidth = 40;
  const logoHeight = 40;
  const pageWidth = doc.internal.pageSize.width;
  const logoX = pageWidth - logoWidth - 15;

  doc.addImage(logoUrl, 'PNG', logoX, 10, logoWidth, logoHeight);

  // Intestazione
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text("Fattura Ordine", 15, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Email cliente: ${ordine.email}`, 15, 36);
  doc.text(`Data ordine: ${new Date(ordine.creatoIl).toLocaleString()}`, 15, 42);

  // Tabella
  autoTable(doc, {
    head: [['Prodotto', 'Quantità', 'Prezzo Unitario', 'Totale']],
    body: data,
    startY: 55,
    headStyles: {
      fillColor: [74, 144, 226], // Blu #4a90e2
      textColor: 255,
      halign: 'center'
    },
    bodyStyles: {
      halign: 'center'
    },
    margin: { left: 15, right: 15 }
  });

  // Totale ordine
  const finalY = (doc as any).lastAutoTable?.finalY || 70;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Totale: ${totaleOrdine.toFixed(2)} €`, 15, finalY + 15);

  // Stampa
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
