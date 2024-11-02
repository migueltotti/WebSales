import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Product } from '../models/product';
import { User } from '../models/user';
import { Category } from '../models/category';
import { FormGroup } from '@angular/forms';
import { request } from 'http';

const apiUrl = 'https://localhost:44373/api/Products';
const apiLoginUrl = 'https://localhost:44373/api/Auth/Login';
var httpOptions = {headers: new HttpHeaders({
  "Content-Type": "application/json"
})};
var token: string | null;


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  montarHeaderToken() {
    token = localStorage.getItem("jwt");
    console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  Login (user: any) {
    return this.http.post<User>(apiLoginUrl, user).pipe(
      tap((user: User) => console.log('Login usuario com email =' + user.email)),
      catchError(this.handleError<User>('Login'))
    );
  }

  getProducts(): Observable<Product[]> {
    console.log(httpOptions.headers);
    return this.http.get<Product[]>(
      apiUrl,
      httpOptions
    ).pipe(
      tap(Products => console.log('products received successfully')),
      catchError(this.handleError('getProducts', []))
    );
  }

  getProduct(id: number): Observable<Product> {
    const url = apiUrl + '/' + id;
    return this.http.get<Product>(
      url, httpOptions
    ).pipe(
      tap((Product: Product) => console.log('product received successfully')),
      catchError(this.handleError<Product>('getProduct id=' + id))
    );
  }

  addproduct(product: Product): Observable<Product> {
    this.montarHeaderToken();
    return this.http.post<Product>(
      apiUrl, product, httpOptions
    ).pipe(
      tap((Product: Product) => console.log('product added successfully with id=' + product.productId)),
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  updateProduct(id: number, product: Product): Observable<any> {
    const url = apiUrl + '/' + id;

    this.montarHeaderToken();
    console.log(url);
    console.log(httpOptions);

    return this.http.put(
      url, product, httpOptions
    ).pipe(
      tap(_ => console.log('product edited successfully with id=' + product.productId)),
      catchError(this.handleError<Product>('updateProduct'))
    );
  }

  deleteProduct(id: number, product: Product): Observable<any> {
    const url = apiUrl + '/' + id;
    
    this.montarHeaderToken();

    return this.http.delete<Product>(
      url, httpOptions
    ).pipe(
      tap(_ => console.log('product edited successfully with id=' + product.productId)),
      catchError(this.handleError<Product>('deleteProduct'))
    );
  }

  toProduct(form: FormGroup<any>) : Product{
    console.log('Dentro do toProduct');
    console.log(form.value);

    const product = new Product(
      parseInt(form.get('productId')?.value, 10),
      form.get('name')?.value,
      form.get('description')?.value,
      parseFloat(form.get('value')?.value),
      parseInt(form.get('typeValue')?.value, 10),
      parseInt(form.get('stockQuantity')?.value, 10),
      form.get('imageUrl')?.value,
      parseInt(form.get('categoryId')?.value, 10)
    );

    return product;
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
  
}
