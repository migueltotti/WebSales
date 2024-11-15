import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { QueryStringParameters } from '../models/queryStringParameters';
import { Order } from '../models/order';

const apiUrl = 'https://localhost:44373/api/Orders';
var httpOptions = {headers: new HttpHeaders({
  "Content-Type": "application/json"
})};
var token: string | null;


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  montarHeaderToken() {
    token = sessionStorage.getItem("jwt");
    console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  getOrders(
    httpOp: {headers: HttpHeaders} = httpOptions,
     parameters: QueryStringParameters | null = null) : Observable<HttpResponse<Order[]>> 
  {
    var apiPagUrl = apiUrl; 

    if(parameters != null){
      apiPagUrl += `?PageNumber=${parameters!.pageNumber}&PageSize=${parameters!.pageSize}`;
    }

    return this.http.get<HttpResponse<Order[]>>(
      apiPagUrl,
      httpOp
    ).pipe(
      tap(Order => console.log('orders received successfully')),
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  getOrdersByUserId(
    id: number,
    httpOp: {headers: HttpHeaders} = httpOptions,
    parameters: QueryStringParameters | null = null) : Observable<Order[]> 
  {
    var url = apiUrl + `/userId/${id}`

    if(parameters != null){
      url += `?PageNumber=${parameters!.pageNumber}&PageSize=${parameters!.pageSize}`;
    }

    this.montarHeaderToken();

    return this.http.get<Order[]>(
      url,
      httpOp
    ).pipe(
      tap(Order => console.log(`orders from user with id=${id} received successfully`)),
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  getOrdersWithProductsByUserId(
    id: number,
    httpOp: {headers: HttpHeaders} = httpOptions,
    parameters: QueryStringParameters | null = null) : Observable<Order[]> 
  {
    var url = apiUrl + `/Products/${id}`

    if(parameters != null){
      url += `?PageNumber=${parameters!.pageNumber}&PageSize=${parameters!.pageSize}`;
    }

    this.montarHeaderToken();

    return this.http.get<Order[]>(
      url,
      httpOp
    ).pipe(
      tap(Order => console.log(`orders from user with id=${id} received successfully`)),
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  getOrder(id: number): Observable<Order> {
    const url = apiUrl + '/' + id;

    return this.http.get<Order>(
      url, httpOptions
    ).pipe(
      tap((order: Order) => console.log('order received successfully')),
      catchError(this.handleError<Order>('getOrder id=' + id))
    );
  }

  addOrder(order: Order): Observable<Order> {
    this.montarHeaderToken();
    return this.http.post<Order>(
      apiUrl, order, httpOptions
    ).pipe(
      tap((Order: any) => console.log('order added successfully')),
      catchError(this.handleError<Order>('addOrder'))
    );
  }

  updateOrder(id: number, order: Order): Observable<any> {
    const url = apiUrl + '/' + id;

    this.montarHeaderToken();
    console.log(url);
    console.log(httpOptions);

    return this.http.put(
      url, order, httpOptions
    ).pipe(
      tap(_ => console.log('order edited successfully with id=' + order.orderId)),
      catchError(this.handleError<Order>('updateOrder'))
    );
  }

  deleteOrder(id: number): Observable<any> {
    const url = apiUrl + '/' + id;
    
    this.montarHeaderToken();

    return this.http.delete<Order>(
      url, httpOptions
    ).pipe(
      tap(_ => console.log('order deleted successfully with id=' + id)),
      catchError(this.handleError<Order>('deleteOrder'))
    );
  }

  toOrder(form: FormGroup<any>) : Order{
    console.log('Dentro do toOrder');
    console.log(form.value);

    const order = new Order(
      parseInt(form.get('orderId')?.value, 10),
      parseFloat(form.get('totalValue')?.value),
      form.get('orderDate')?.value,
      parseInt(form.get('orderStatus')?.value, 10),
      parseInt(form.get('userId')?.value, 10),
    );

    return order;
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
  
}
