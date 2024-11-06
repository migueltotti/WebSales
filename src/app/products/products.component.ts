import { Component, OnInit, ChangeDetectionStrategy, PLATFORM_ID, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../services/auth.service';
import { NgIf, NgStyle, isPlatformBrowser } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { PaginationInfo } from '../../models/paginationInfo';
import { PaginationService } from '../../services/pagination.service';
import { QueryStringParameters } from '../../models/queryStringParameters';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatPaginator,
    RouterLink,
    NgIf,
    NgStyle
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
  dataSource: Product[] = [];
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
    private pag: PaginationService
  ) { }

  ngOnInit() {
    this.api.getProducts(this.httpOptions)
    .subscribe({
      next: (res) => {
        this.dataSource = res.body || [];
        console.log(this.dataSource);

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
        this.dataSource = res.body || [];

        this.paginationInfo = this.pag.getPaginationInfo(res);
        this.length = this.paginationInfo.TotalItemCount;
        this.pageSize = this.paginationInfo.PageSize;
        this.pageIndex = this.paginationInfo.PageNumber! - 1;

        console.log(this.dataSource);
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
}

/*
@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog-animations-example-dialog.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsExampleDialog {

  constructor(private dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
  //readonly dialogRef = inject(MatDialogRef<DialogAnimationsExampleDialog>);
}

// (click)="checkRow(row)"
// [class.demo-row-is-clicked]="isRowSelected(row)"


<!-- ProductId Column -->
    <ng-container matColumnDef="productId">
      <mat-header-cell *matHeaderCellDef> Id </mat-header-cell>
      <mat-cell *matCellDef="let element"> {{element.productId}} </mat-cell>
    </ng-container>

    <!-- Description Column -->
    <ng-container matColumnDef="description">
      <mat-header-cell *matHeaderCellDef> Descricao </mat-header-cell>
      <mat-cell *matCellDef="let element"> {{element.description}} </mat-cell>
    </ng-container>


      <!-- ImageUrl Column -->
    <ng-container matColumnDef="imageUrl">
        <mat-header-cell *matHeaderCellDef> Imagem </mat-header-cell>
        <mat-cell *matCellDef="let element"> {{element.imageUrl}} </mat-cell>
      </ng-container>

      
      <!-- CategoryId Column -->
    <ng-container matColumnDef="categoryId">
        <mat-header-cell *matHeaderCellDef> Categoria </mat-header-cell>
        <mat-cell *matCellDef="let element"> {{element.categoryId}} </mat-cell>
      </ng-container>

*/