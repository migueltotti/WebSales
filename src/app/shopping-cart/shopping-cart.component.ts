import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product';
import { NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

const productsTest = [
  new Product(1, 'prodTeste1', 'prodTeste1', 10, 1, 10, 'prodTeste.jpg', 1),
  new Product(2, 'prodTeste2', 'prodTeste2', 20, 1, 10, 'prodTeste.jpg', 1),
  new Product(3, 'prodTeste3', 'prodTeste3', 30, 1, 10, 'prodTeste.jpg', 1),
  new Product(4, 'prodTeste4', 'prodTeste4', 40, 1, 10, 'prodTeste.jpg', 1),
]

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    MatCardModule,
    MatDivider,
    MatCheckboxModule,
    CurrencyPipe,
    NgFor,
    MatButton,
    MatIcon,
    MatGridListModule
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  products!: Product[];
  quantity!: number;

  constructor() {
    this.products = productsTest;
  }

  decreaseQuantity(prodId: number) {
    var prod = this.products.find(p => p.productId == prodId);

    if(prod?.stockQuantity! > 0){
      prod!.stockQuantity--;
    }
  }
  
  increaseQuantity(prodId: number) {
    var prod = this.products.find(p => p.productId == prodId);

    prod!.stockQuantity++;
  }

  checkout() {
    console.log('s');
  }

  calculateTotal(): number {
    var total = 0;

    for(var i = 0; i < this.products.length; i++){
      total += this.products[i].value;
    }

    return total;
  }

  removeFromCart(_t3: any) {
    console.log('s');
  }

}

/* 
<div class="cart-container">
    <mat-card *ngFor="let prod of products" class="example-card">
        <mat-grid-list cols="3">
            <img mat-card-image src="/coca_cola.png" width="100" height="100" alt="{{prod.name}}" class="order-product-image">

            <mat-card-content>
                <mat-card-title>{{ prod.name }}</mat-card-title>
                <mat-card-subtitle>Price: {{ prod.value| currency }}</mat-card-subtitle>
                <p>{{ prod.description }}</p>
                <div class="quantity-controls">
                    <button mat-button color="primary" (click)="decreaseQuantity(prod.productId)">
                    <mat-icon>add</mat-icon>
                    </button>
                    <span>{{ prod.stockQuantity }}</span>
                    <button mat-button color="primary" class="decrease-quantity" (click)="increaseQuantity(prod.productId)">
                    <mat-icon>minimize</mat-icon>
                    </button>
                </div>
            </mat-card-content>

            <mat-card-actions>
            <mat-checkbox [checked]="true">Select</mat-checkbox>
            <button mat-button color="warn" (click)="removeFromCart(prod)">Remove</button>

            </mat-card-actions>
        </mat-grid-list>
    </mat-card>
  
    <mat-divider></mat-divider>
</div>
    
<div class="cart-summary">
    <h3>Total: {{ calculateTotal() | currency }}</h3>
    <button mat-raised-button color="primary" (click)="checkout()">Checkout</button>
</div>
  
*/
