import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { BrlPipe } from '../extensions/valuePipe';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCart } from '../../models/shoppingCart';
import { AuthService } from '../../services/auth.service';
import { ControlEvent } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductChecked } from '../../models/ProductChecked';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    MatCardModule,
    MatDivider,
    MatCheckboxModule,
    CommonModule,
    NgFor,
    MatButton,
    MatIcon,
    MatGridListModule,
    BrlPipe,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent implements OnInit {
  userId!: number;
  shoppingCart!: ShoppingCart;
  inAction = false;
  readonly Kg = 1;

  constructor(
    private shoppingCartServ: ShoppingCartService,
    private authServ: AuthService,
    private snackBarServ: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authServ.getUserIdFromStorage()!;

    this.getShoppingCart();
  }

  decreaseQuantity(prodId: number) {
    var decreaseAmount: number;
    this.inAction = true;
    var prod = this.shoppingCart.products.find(p =>
      p.product.productId == prodId
    );

    if(prod?.product.typeValue == this.Kg){
      decreaseAmount = 0.100;
    }
    else{
      decreaseAmount = 1;
    }

    if(prod!.amount > 0){
      prod!.amount -= decreaseAmount;
    }

    this.shoppingCartServ.updateProductAmountFromShoppingCartProductByUserId(this.userId, prod!.product.productId, prod!.amount)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.inAction = false;
      }
    })
  }
  
  increaseQuantity(prodId: number) {
    var increaseAmount: number;
    this.inAction = true;
    var prod = this.shoppingCart.products.find(p =>
      p.product.productId == prodId
    );

    if(prod?.product.typeValue == this.Kg){
      increaseAmount = 0.100;
    }
    else{
      increaseAmount = 1;
    }

    prod!.amount += increaseAmount;

    this.shoppingCartServ.updateProductAmountFromShoppingCartProductByUserId(this.userId, prod!.product.productId, prod!.amount)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.inAction = false;
      }
    })
  }

  checkout() {
    console.log('checkout');
  }

  calculateTotal(): number {
    var total = 0;

    this.shoppingCart.products.forEach(
      p => {
        if(p.checked == true)
          total += (p.product.value * p.amount)
      }
    )

    return total;
  }

  changeCheckState(prod: ProductChecked){
    this.inAction = true;
    prod.checked = prod.checked ? false : true;

    console.log(prod.checked);

    if(prod.checked == true){
      this.shoppingCartServ.checkProductFromShoppingCartByUserId(this.userId, prod.product.productId)
      .subscribe({
        next: (data) => {
          console.log(data)
          this.inAction = false;
        }
      });
    }
    else{
      this.shoppingCartServ.uncheckProductFromShoppingCartByUserId(this.userId, prod.product.productId)
      .subscribe({
        next: (data) => {
          console.log(data)
          this.inAction = false;
        }
      });
    }
  }

  getTotalSelectItens() : number{
    var total = 0;

    for(var p of this.shoppingCart.products){
      if(p.checked == true){
        total++;
      }
    }

    return total;
  }

  removeFromCart(prodId: number) {
    this.inAction = true;

    this.shoppingCartServ.removeProductFromShoppingCartByUserId(this.userId, prodId)
    .subscribe({
      next: (data) => {
        this.shoppingCart = data;
        console.log(data);
        this.snackBarServ.openSuccessSnackBar('Product removed successfuly!');
        this.inAction = false;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getShoppingCart() {
    this.shoppingCartServ.getShoppingCartByUserId(this.userId)
    .subscribe({
      next: (data) => {
        this.shoppingCart = data;
      },
      error: (err) => {
        console.error('An error occurred while getting the ShoppingCart!');
        this.snackBarServ.openErrorSnackBar('An error occurred while getting the ShoppingCart!');
        this.router.navigate(['/home']);
      },
      complete: () => {
        console.log('ShoppingCart received successfuly!');
      }
    });
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
  



<div class="cart-summary">
            <h3>Total: {{ calculateTotal() | currency }}</h3>
            <button mat-raised-button color="primary" (click)="checkout()">Checkout</button>
        </div>
*/
