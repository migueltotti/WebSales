import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { QueryStringParameters } from '../models/queryStringParameters';
import { ShoppingCart } from '../models/shoppingCart';


const apiUrl = 'https://localhost:44373/api/ShoppingCarts';
var httpOptions = {headers: new HttpHeaders({
  "Content-Type": "application/json"
})};
var token: string | null;

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private http: HttpClient) { }

  montarHeaderToken() {
    token = sessionStorage.getItem("jwt");
    console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  getShoppingCartByUserId(userId: number): Observable<ShoppingCart> {

    const url = apiUrl + '/' + userId;

    this.montarHeaderToken();
    return this.http.get<ShoppingCart>(
      url, httpOptions
    ).pipe(
      tap((ShoppingCart: ShoppingCart) => console.log('shoppingCart received successfully')),
      catchError(this.handleError<ShoppingCart>('getgetShoppingCartUser'))
    );
  }

  addProductToShoppingCartByUserId(userId: number, productId: number, amount: number): Observable<ShoppingCart> {

    const url = `${apiUrl}/${userId}/AddProduct/${productId}?amount=${amount}`;

    this.montarHeaderToken();

    return this.http.post<ShoppingCart>(
      url, null, httpOptions
    ).pipe(
      tap((Product: any) => console.log('product added successfully to shoppingCart')),
      catchError(this.handleError<ShoppingCart>('addProductToShoppingCartByUserId'))
    );
  }

  removeProductFromShoppingCartByUserId(userId: number, productId: number): Observable<ShoppingCart> {
    
    const url = `${apiUrl}/${userId}/RemoveProduct/${productId}`;
    
    this.montarHeaderToken();

    return this.http.delete<ShoppingCart>(
      url, httpOptions
    ).pipe(
      tap(_ => console.log('product removed successfully from shoppingCart')),
      catchError(this.handleError<ShoppingCart>('removeProductFromShoppingCartByUserId'))
    );
  }

  clearShoppingCart(userId: number): Observable<any> {
    
    const url = apiUrl + '/' + userId + '/ClearCart';
    
    this.montarHeaderToken();

    return this.http.delete<ShoppingCart>(
      url, httpOptions
    ).pipe(
      tap(_ => console.log('shopping cart cleared successfully')),
      catchError(this.handleError<ShoppingCart>('clearShoppingCart'))
    );
  }

  checkProductFromShoppingCartByUserId(userId: number, productId: number): Observable<ShoppingCart> {
    const url = `${apiUrl}/${userId}/CheckProduct/${productId}`;

    console.log('checkproduct');

    this.montarHeaderToken();

    console.log(httpOptions);

    return this.http.post<ShoppingCart>(
      url, null, httpOptions
    ).pipe(
      tap((Product: any) => console.log('product checked successfully to shoppingCart')),
      catchError(this.handleError<ShoppingCart>('checkProductFromShoppingCartByUserId'))
    );
  }

  uncheckProductFromShoppingCartByUserId(userId: number, productId: number): Observable<ShoppingCart> {
    const url = `${apiUrl}/${userId}/UncheckProduct/${productId}`;

    this.montarHeaderToken();

    return this.http.post<ShoppingCart>(
      url, null, httpOptions
    ).pipe(
      tap((Product: any) => console.log('product unchecked successfully to shoppingCart')),
      catchError(this.handleError<ShoppingCart>('uncheckProductFromShoppingCartByUserId'))
    );
  }

  updateProductAmountFromShoppingCartProductByUserId(userId: number, productId: number, amount: number): Observable<ShoppingCart> {
    const url = `${apiUrl}/${userId}/UpdateProductAmount/${productId}?amount=${amount}`;

    this.montarHeaderToken();

    return this.http.put<ShoppingCart>(
      url, null, httpOptions
    ).pipe(
      tap((Product: any) => console.log('product amount updated successfully to shoppingCart')),
      catchError(this.handleError<ShoppingCart>('updateProductAmountFromShoppingCartProductByUserId'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
