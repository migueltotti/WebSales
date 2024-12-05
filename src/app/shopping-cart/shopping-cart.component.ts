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
import { OrderService } from '../../services/order.service';

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
    private orderServ: OrderService,
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
        this.shoppingCart = data;
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
        this.shoppingCart = data;
        this.inAction = false;
      }
    })
  }

  checkout() {
    this.inAction = true;
    this.orderServ.createAndSendOrderByShoppingCart(this.userId)
    .pipe(
      switchMap(order => {
        console.log(order);
        return this.shoppingCartServ.getShoppingCartByUserId(this.userId);
      })
    ).subscribe({
      next: (data) => {
        this.shoppingCart = data;
        this.snackBarServ.openSuccessSnackBar('Order created successfuly!');
      },
      error: (err) => {
        console.error('An error occurred while getting the ShoppingCart!');
        this.snackBarServ.openErrorSnackBar('An error occurred while getting the ShoppingCart!');
        this.router.navigate(['/home']);
      },
      complete: () => {
        console.log('ShoppingCart received successfuly!');
        this.inAction = false;
      }
    });
  }

  changeCheckState(prod: ProductChecked){
    this.inAction = true;
    prod.checked = prod.checked ? false : true;

    console.log(prod.checked);

    if(prod.checked == true){
      this.shoppingCartServ.checkProductFromShoppingCartByUserId(this.userId, prod.product.productId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.shoppingCart = data;
          this.inAction = false;
        }
      });
    }
    else{
      this.shoppingCartServ.uncheckProductFromShoppingCartByUserId(this.userId, prod.product.productId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.shoppingCart = data;
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
        this.snackBarServ.openErrorSnackBar('Error while removing product!');
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