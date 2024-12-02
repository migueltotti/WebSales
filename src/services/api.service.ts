import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Product } from '../models/product';
import { LoginModel } from '../models/loginModel';
import { Category } from '../models/category';
import { FormGroup } from '@angular/forms';
import { request } from 'http';
import { QueryStringParameters } from '../models/queryStringParameters';

const apiUrl = 'https://localhost:44373/api/Products';
//const apiLoginUrl = 'https://localhost:44373/api/Auth/Login';
var httpOptions = {headers: new HttpHeaders({
  "Content-Type": "application/json"
})};
var token: string | null;

const Kg = 1;
const Uni = 2;


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  montarHeaderToken() {
    token = sessionStorage.getItem("jwt");
    console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  /*Login (loginModel: any) {
    return this.http.post<LoginModel>(apiLoginUrl, loginModel).pipe(
      tap(() => console.log('Login usuario com email =' + loginModel.email)),
      catchError(this.handleError<LoginModel>('Login'))
    );
  }*/

  getProducts(
    httpOp: {headers: HttpHeaders} = httpOptions,
     parameters: QueryStringParameters | null = null) : Observable<HttpResponse<Product[]>> 
  {
    var apiPagUrl = apiUrl; 

    if(parameters != null){
      apiPagUrl += `?PageNumber=${parameters!.pageNumber}&PageSize=${parameters!.pageSize}`;
    }

    return this.http.get<HttpResponse<Product[]>>(
      apiPagUrl,
      httpOp
    ).pipe(
      tap(Products => console.log('products received successfully')),
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
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
      tap((Product: any) => console.log('product added successfully')),
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

  deleteProduct(id: number): Observable<any> {
    const url = apiUrl + '/' + id;
    
    this.montarHeaderToken();

    return this.http.delete<Product>(
      url, httpOptions
    ).pipe(
      tap(_ => console.log('product deleted successfully with id=' + id)),
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

  getProductAmount(products: Product[], prodId: number) : number{
    var amount = 0;

    // Funcao para aumentar a quantidade do produto escolhido baseado no TypeValue
    // Para Kg => 100g em 100g
    // Para Uni => 1 em 1

    /*products.forEach(p => {
      if(p.productId == prodId){
        switch (p.typeValue){
          case Kg:
            amount = 
        }
      }
    })*/

    return amount;
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
  
}
