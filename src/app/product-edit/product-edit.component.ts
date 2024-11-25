import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormField, MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../models/product';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatButtonModule,
    NgFor,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditComponent implements OnInit {

  productId: number = 0;
  productForm: FormGroup | undefined;

  categories: Category[] = [];
  tipoValores = [{nome: "Unidade", id: 2}, {nome: "Kilo", id: 1}];

  isLoadingResults = false;

  teste = false;

  constructor(
    private api: ApiService,
    private catServ: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(){
    this.getCategories();
    this.getProduct(this.route.snapshot.params['id']);
    this.productForm = this.formBuilder.group({  
      'productId': [null],
      'name' : [null, Validators.required],
      'description' : [null, Validators.required],
      'value' : [null, Validators.required],
      'typeValue' : [null, Validators.required],
      'stockQuantity' : [null, Validators.required],
      'imageUrl' : [null, Validators.required],
      'categoryId' : [null, Validators.required],
    });
  }

  getProduct(id: number){
    this.api.getProduct(id).subscribe(res =>{
      //console.log(res);
      this.productId = res.productId;
      this.productForm?.setValue({
        productId: res.productId,
        name: res.name,
        description: res.description,
        value: res.value,
        typeValue: res.typeValue,
        stockQuantity: res.stockQuantity,
        imageUrl: res.imageUrl,
        categoryId: res.categoryId,
      });
    });
  }

  getCategories(){
    this.catServ.getCategories().subscribe(data =>{
      this.categories = data;
    });
  }

  updateProduct() {
    this.isLoadingResults = true;
    //console.log("botao acionado");

    const product = this.api.toProduct(this.productForm!);
    //const product = this.productForm?.value;
    //console.log('Depois do toProduct: ');
    //console.log(product);
    
    
    this.api.updateProduct(this.productId, product)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.isLoadingResults = false;
        this.router.navigate(['/products']);
        this.snackBar.openSuccessSnackBar('Product Updated Successfuly');
      },
      error: (err) => {
        console.log(err);
        this.isLoadingResults = false;
        this.snackBar.openErrorSnackBar('Unable to Updated Product! Try again later');
      },
      complete: () => {
        console.log('request completed: updateProduct');
      }
    });
  }

  formatValue(){
    const valorControl = this.productForm!.get('Value');
    let valor = valorControl?.value;

    if (valor) {
      // Aplica duas casas decimais e ajusta para o mínimo se necessário
      valor = parseFloat(valor).toFixed(2);
      if (parseFloat(valor) < 0.01) {
        valor = '0.01'; // Garante o valor mínimo
      }
      valorControl?.setValue(valor);
    } else {
      // Define placeholder padrão ao sair do campo vazio
      valorControl?.setValue('0.00');
    }
  }
}
