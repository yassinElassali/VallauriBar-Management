import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestione-menu',
  templateUrl: './gestione-menu.component.html',
  styleUrls: ['./gestione-menu.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class GestioneMenuComponent implements OnInit {
  activeTab: 'cibo' | 'bevande' | 'aggiungi' = 'cibo';

  menuCibo: any[] = [];
  menuBevande: any[] = [];

  showPopup: boolean = false;
  prodottoSelezionato: any = null;
  tipoMenuSelezionato: 'cibo' | 'bevande' = 'cibo';

  nuovoProdotto = {
    tipo: 'cibo',
    nome: '',
    prezzo: 0
  };

  private readonly BASE_URL = 'https://management.vallauribar.connectify.it/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMenuCibo();
    this.fetchMenuBevande();
  }

  switchTab(tab: 'cibo' | 'bevande' | 'aggiungi') {
    this.activeTab = tab;
  }

  fetchMenuCibo() {
    this.http.get<any[]>(`${this.BASE_URL}/menuCibo`).subscribe({
      next: data => this.menuCibo = data,
      error: err => {
        console.error("Errore nel caricamento del menu cibo:", err);
        alert("Errore nel caricamento del menu cibo.");
      }
    });
  }

  fetchMenuBevande() {
    this.http.get<any[]>(`${this.BASE_URL}/menuBevande`).subscribe({
      next: data => this.menuBevande = data,
      error: err => {
        console.error("Errore nel caricamento del menu bevande:", err);
        alert("Errore nel caricamento del menu bevande.");
      }
    });
  }

  apriPopup(prodotto: any, tipo: 'cibo' | 'bevande') {
    this.prodottoSelezionato = { ...prodotto };
    this.tipoMenuSelezionato = tipo;
    this.showPopup = true;
  }

  chiudiPopup() {
    this.showPopup = false;
    this.prodottoSelezionato = null;
  }

  salvaModifiche() {
    const url = `${this.BASE_URL}/${this.tipoMenuSelezionato}/${this.prodottoSelezionato._id}`;
    this.http.put(url, this.prodottoSelezionato).subscribe({
      next: () => {
        if (this.tipoMenuSelezionato === 'cibo') {
          this.fetchMenuCibo();
        } else {
          this.fetchMenuBevande();
        }
        this.chiudiPopup();
      },
      error: err => {
        console.error("Errore nella modifica:", err);
        alert("Errore nel salvataggio del prodotto.");
      }
    });
  }

  eliminaProdotto(id: string, tipo: 'cibo' | 'bevande') {
    const url = `${this.BASE_URL}/${tipo}/${id}`;
    if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      this.http.delete(url).subscribe({
        next: () => {
          if (tipo === 'cibo') {
            this.fetchMenuCibo();
          } else {
            this.fetchMenuBevande();
          }
        },
        error: err => {
          console.error("Errore nell'eliminazione:", err);
          alert("Errore durante l'eliminazione del prodotto.");
        }
      });
    }
  }

  aggiungiProdotto() {
    const url = `${this.BASE_URL}/${this.nuovoProdotto.tipo}`;
    this.http.post(url, {
      nome: this.nuovoProdotto.nome,
      prezzo: this.nuovoProdotto.prezzo
    }).subscribe({
      next: () => {
        alert("Prodotto aggiunto con successo!");

        // Aggiorna la lista corretta in base al tipo
        if (this.nuovoProdotto.tipo === 'cibo') {
          this.fetchMenuCibo();
        } else {
          this.fetchMenuBevande();
        }

        // Dopo aver aggiunto, torna al tab corretto e resetta il form
        this.switchTab(this.nuovoProdotto.tipo as 'cibo' | 'bevande' | 'aggiungi');
        this.nuovoProdotto = { tipo: 'cibo', nome: '', prezzo: 0 };
      },
      error: err => {
        console.error("Errore nell'aggiunta:", err);
        alert("Errore durante l'aggiunta del prodotto.");
      }
    });
  }
}
