import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationInfo } from '../models/paginationInfo';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }

  getPaginationInfo(response: HttpResponse<any>) : PaginationInfo{
    var paginationInfo = new PaginationInfo();

    //console.log(response.headers);
    const paginationHeader = response.headers.get('X-Pagination');
    //console.log(paginationHeader);

    if(paginationHeader != null){
      paginationInfo = JSON.parse(paginationHeader);
    }

    return paginationInfo;
  }
}
