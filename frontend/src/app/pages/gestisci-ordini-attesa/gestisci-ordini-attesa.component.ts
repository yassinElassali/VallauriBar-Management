import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface CartItem {
  nome: string;
  quantita: number;
  prezzo: number;
}

@Component({
  selector: 'app-gestisci-ordini-attesa',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './gestisci-ordini-attesa.component.html',
  styleUrls: ['./gestisci-ordini-attesa.component.css']
})


export class GestisciOrdiniAttesaComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  private intervalId: any;

  showPopup: boolean = false;
  popupMessage: string = '';
  isErrorPopup: boolean = false;

  popupMouseOver: boolean = false;

  selectedOrder: any = null;
  disponibili: any[] = [];
  nonDisponibili: any[] = [];
  showResocontoPopup: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getOrders();
    this.startAutoUpdate();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoUpdate(): void {
    this.intervalId = setInterval(() => {
      this.getOrders();
    }, 6000);
  }

  getOrders(): void {
    this.http.get<any[]>('http://109.123.240.145:4000/ordiniInAttesa')
      .subscribe(
        (data) => {
          this.orders = data;
        },
        (error) => {
          console.error('Errore nel recupero degli ordini', error);
        }
      );
  }

  acceptOrder(order: any): void {
    if (typeof order.email !== 'string' || typeof order.codiceOrdine !== 'string' || !Array.isArray(order.cartItems)) {
      this.showErrorPopup("Dati non validi, impossibile accettare l'ordine.");
      return;
    }

    this.http.post('http://109.123.240.145:4000/accettaOrdine', {
      email: order.email,
      ordineId: order.codiceOrdine,
      prodotti: order.cartItems
    }).subscribe(
      (response) => {
        this.http.post('http://109.123.240.145:4000/ordini/email-accettata', {
          email: order.email,
          codiceOrdine: order.codiceOrdine,
          cartItems: order.cartItems
        }).subscribe(
          (emailRes) => {
            this.showSuccessPopup("Ordine accettato e email inviata con successo!");
            this.getOrders();
            window.location.reload();
          },
          (emailErr) => {
            console.error("Errore nell'invio dell'email:", emailErr);
            this.showErrorPopup("Ordine accettato ma errore nell'invio dell'email.");
            this.getOrders();
          }
        );
      },
      (error) => {
        console.error('Errore:', error);
        const message = error.error?.message || "Errore nell'accettazione dell'ordine.";
        this.showErrorPopup(message);
      }
    );
  }

  onCheckboxChange(item: any, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    item.disponibile = inputElement.checked;
  }
  
  
  rejectOrder(order: any): void {
    this.selectedOrder = order;
    this.disponibili = [];
    this.nonDisponibili = [];
  
    this.selectedOrder.cartItems = this.selectedOrder.cartItems.map((item: any) => ({
      ...item,
      disponibile: true 
    }));
  
    this.showResocontoPopup = true;
  }
  

  toggleProductSelection(item: any, disponibile: boolean): void {
    const arrayFrom = disponibile ? this.nonDisponibili : this.disponibili;
    const arrayTo = disponibile ? this.disponibili : this.nonDisponibili;
  
    const index = arrayFrom.findIndex(i => i.nome === item.nome);
    if (index !== -1) arrayFrom.splice(index, 1);
  
    if (!arrayTo.some(i => i.nome === item.nome)) {
      arrayTo.push(item);
    }
  }
  

  inviaResoconto(): void {
    if (!this.selectedOrder) return;
  
    this.disponibili = this.selectedOrder.cartItems.filter((item: any) => item.disponibile);
    this.nonDisponibili = this.selectedOrder.cartItems.filter((item: any) => !item.disponibile);
  
    this.http.post('http://109.123.240.145:4000/ordini/email-rifiutata', {
      email: this.selectedOrder.email,
      codiceOrdine: this.selectedOrder.codiceOrdine,
      disponibili: this.disponibili,
      nonDisponibili: this.nonDisponibili
    }).subscribe(
      () => {
        this.showSuccessPopup("Resoconto inviato con successo");
        this.showResocontoPopup = false;
        this.ordineRifiutato();
      },
      (error) => {
        console.error("Errore invio resoconto", error);
        this.showErrorPopup("Errore nell'invio del resoconto");
      }
    );
  }
  
  ordineRifiutato(): void {
    if (!this.selectedOrder) return;
  
    this.http.post('http://109.123.240.145:4000/rifiutaOrdine', {
      email: this.selectedOrder.email,
      ordineId: this.selectedOrder.codiceOrdine,
      prodotti: [...this.disponibili, ...this.nonDisponibili]
    }).subscribe(
      (response) => {
        console.log("Ordine rifiutato con successo", response);
        this.getOrders();
        window.location.reload();
      },
      (error) => {
        console.error("Errore nel rifiuto dell'ordine", error);
        this.showErrorPopup("Errore nel rifiuto dell'ordine");
      }
    );
  }
  
  showSuccessPopup(message: string): void {
    if (this.showPopup || this.popupMouseOver) return;
    this.popupMessage = message;
    this.isErrorPopup = false;
    this.showPopup = true;
    setTimeout(() => this.showPopup = false, 3000);
  }
  
  showErrorPopup(message: string): void {
    if (this.showPopup || this.popupMouseOver) return; 
    this.popupMessage = message;
    this.isErrorPopup = true;
    this.showPopup = true;
    setTimeout(() => this.showPopup = false, 4000);
  }

  getAvailableItems(): CartItem[] {
    if (!Array.isArray(this.selectedOrder?.cartItems)) {
      return [];
    }
    return this.selectedOrder.cartItems.filter((item: CartItem) => 
      this.isProductAvailable(item)
    );
  }
  
  getUnavailableItems(): CartItem[] {
    if (!Array.isArray(this.selectedOrder?.cartItems)) {
      return [];
    }
    return this.selectedOrder.cartItems.filter((item: CartItem) => 
      this.isProductUnavailable(item)
    );
  }

  isProductAvailable(item: any): boolean {
    // Implementa qui la logica per determinare se un prodotto è disponibile
    return this.disponibili.some(i => i.nome === item.nome);
  }

  isProductUnavailable(item: any): boolean {
    // Implementa qui la logica per determinare se un prodotto è non disponibile
    return this.nonDisponibili.some(i => i.nome === item.nome);
  }
}

