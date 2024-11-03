import { Component, OnInit, ChangeDetectionStrategy, PLATFORM_ID, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { NgIf, NgStyle, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterLink,
    NgIf,
    NgStyle
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit{
  displayedColumns: string[] = [
    'productId',
    'name',
    'description',
    'value',
    'typeValue',
    'stockQuantity',
    'imageUrl',
    'categoryId',
    'action'
  ];
  dataSource: Product[] = [];
  isLoadingResults = true;

  rowSelected: string = '';

  isAdmin: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private api: ApiService,
    private auth: AuthService,
    //private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.api.getProducts()
    .subscribe({
      next: (res) => {
        this.dataSource = res;
        console.log(this.dataSource);
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

  /*openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }*/
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
// [class.demo-row-is-clicked]="isRowSelected(row)"*/