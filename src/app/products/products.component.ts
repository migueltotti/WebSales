import { Component, OnInit, ChangeDetectionStrategy, PLATFORM_ID, Inject, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule}  from '@angular/material/icon'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { NgIf, NgStyle, isPlatformBrowser } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { PaginationInfo } from '../../models/paginationInfo';
import { PaginationService } from '../../services/pagination.service';
import { QueryStringParameters } from '../../models/queryStringParameters';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { throwError } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { NgOptimizedImage } from '@angular/common';

const productsTest = [
  new Product(1, 'prodTeste1', 'prodTeste1 alwhd;aow awuhda hdha whwiadihawhdiua alklwjdoaoahwiuawdiuawiudaihd', 10, 1, 10, 'prodTeste.jpg', 1),
  new Product(2, 'prodTeste2', 'prodTeste2 muito suculento colhido hoje mesmo de manha no quinto do meu quintal', 20, 1, 10, 'prodTeste.jpg', 1),
  new Product(3, 'prodTeste3', 'prodTeste3', 30, 1, 10, 'prodTeste.jpg', 1),
  new Product(4, 'prodTeste4', 'prodTeste4', 40, 1, 10, 'prodTeste.jpg', 1),
]

const TypeValue = new Map([
  [1, 'Kg'],
  [2, 'Uni']
]);

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    NgOptimizedImage,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatPaginator,
    RouterLink,
    NgIf,
    NgStyle,
    MatCardModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})

export class ProductsComponent implements OnInit{
  displayedColumns: string[] = [
    //'productId',
    'name',
    //'description',
    'value',
    'typeValue',
    'stockQuantity',
    //'imageUrl',
    //'categoryId',
    'action'
  ];
  products: Product[] = [];
  typeValue = TypeValue;
  isLoadingResults = true;

  rowSelected: string = '';

  isAdmin: boolean = false;

  // Pagination
  paginationInfo: PaginationInfo | undefined;

  length: number | undefined;
  pageSize: number | undefined;
  pageIndex: number | undefined;
  pageSizeOptions = [5, 10, 25, 50];

  pageEvent: PageEvent | undefined;

  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json'
    }),
    observe: 'response' 
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private api: ApiService,
    private auth: AuthService,
    private shoppingCartService: ShoppingCartService,
    private pag: PaginationService,
    private snackBar: SnackbarService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    /*this.products = productsTest;
    this.length = 4;
    this.pageSize = 10;
    this.pageIndex = 1 - 1;
    this.isAdmin = false;*/

    this.api.getProducts(this.httpOptions)
    .subscribe({
      next: (res) => {
        this.products = res.body || [];
        console.log(this.products);

        this.paginationInfo = this.pag.getPaginationInfo(res);
        this.length = this.paginationInfo.TotalItemCount;
        this.pageSize = this.paginationInfo.PageSize;
        this.pageIndex = this.paginationInfo.PageNumber! - 1;

        console.log(this.paginationInfo);
        
        this.isLoadingResults = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoadingResults = false;
      },
      complete: () => {
        console.log('Completed request!');
      }
    });

    if(isPlatformBrowser(this.platformId)) {
      this.isAdmin = this.auth.isAdmin();
    }
  }

  checkRow(row: any){
    this.rowSelected = row;
    //this.openDialog('0ms', '0ms');
  }

  isRowSelected(row: any): boolean{
    return this.rowSelected == row;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.api.getProducts(this.httpOptions, new QueryStringParameters(this.pageSize, this.pageIndex + 1))
    .subscribe({
      next: (res) => {
        this.products = res.body || [];

        this.paginationInfo = this.pag.getPaginationInfo(res);
        this.length = this.paginationInfo.TotalItemCount;
        this.pageSize = this.paginationInfo.PageSize;
        this.pageIndex = this.paginationInfo.PageNumber! - 1;

        console.log(this.products);
        console.log(this.paginationInfo);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Pagination changed: products loaded');
      }
    })
  }

  addToShoppingCart(prodId: number) {
    var userId = this.auth.getUserIdFromStorage();

    if(userId != null){
      this.shoppingCartService
      .addProductToShoppingCartByUserId(userId, prodId, 1)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.snackBar.openSuccessSnackBar('Product added successfully');
        }, 
        error: (err) => {
          console.log(err);
          this.snackBar.openErrorSnackBar('Error while adding Product! Try again later');
        }
      });
    }
    else{
      this.snackBar.openErrorSnackBar('User not logged! Login to complete action.')
    }
  }
  
}