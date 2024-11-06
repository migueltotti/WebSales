import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from '../models/user';
import { Category } from '../models/category';

const apiUrl = 'https://localhost:44373/api/Categories';
var httpOptions = {headers: new HttpHeaders({
  "Content-Type": "application/json"
})};
var token: string | null;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  montarHeaderToken() {
    token = sessionStorage.getItem("jwt");
    console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }


  getCategories(): Observable<Category[]> {
    console.log(httpOptions.headers);
    return this.http.get<Category[]>(
      apiUrl,
      httpOptions
    ).pipe(
      tap(Products => console.log('category received successfully')),
      catchError(this.handleError('getCategories', []))
    );
  }

  getCategory(id: number): Observable<Category> {
    const url = apiUrl + '/' + id;
    return this.http.get<Category>(
      url, httpOptions
    ).pipe(
      tap((Product: Category) => console.log('category received successfully')),
      catchError(this.handleError<Category>('getCategory id=' + id))
    );
  }

  addCategory(category: Category): Observable<Category> {
    this.montarHeaderToken();
    return this.http.post<Category>(
      apiUrl, category, httpOptions
    ).pipe(
      tap((Product: Category) => console.log('category added successfully with id=' + category.categoryId)),
      catchError(this.handleError<Category>('addCategory'))
    );
  }

  updateCategory(id: string, category: Category): Observable<any> {
    const url = apiUrl + '/' + id;
    return this.http.put(
      url, category, httpOptions
    ).pipe(
      tap(_ => console.log('category edited successfully with id=' + category.categoryId)),
      catchError(this.handleError<Category>('updateCategory'))
    );
  }

  deleteCategory(id: number, category: Category): Observable<any> {
    const url = apiUrl + '/' + id;
    return this.http.delete<Category>(
      url, httpOptions
    ).pipe(
      tap(_ => console.log('category edited successfully with id=' + category.categoryId)),
      catchError(this.handleError<Category>('deleteCategory'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
  
}
