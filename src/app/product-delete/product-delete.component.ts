import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-product-delete',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    RouterLink
  ],
  templateUrl: './product-delete.component.html',
  styleUrl: './product-delete.component.scss'
})
export class ProductDeleteComponent implements OnInit {

  productId: number = 0;
  product: Product | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private snackBar: SnackbarService
  ){}

  ngOnInit(){
    this.productId = this.route.snapshot.params['id'];
    this.api.getProduct(this.productId)
    .subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('product request completed!');
      }
    });
  }

  confirmDelete(){
    this.api.deleteProduct(this.productId)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/products']);
        this.snackBar.openSuccessSnackBar('Product Deleted Successfuly')
      },
      error: (err) => {
        console.log(err);
        this.snackBar.openErrorSnackBar('Unable to Delete Product! Try again later');
      },
      complete: () => {
        console.log('request completed: deleteProduct');
      }
    })
  }
}
