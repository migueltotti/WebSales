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

@Component({
  selector: 'app-product-create',
  standalone: true,
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
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})

export class ProductCreateComponent implements OnInit{

  productId: number = 0;
  productForm: FormGroup | undefined;

  categories: Category[] = [];
  tipoValores = [{nome: "Unidade", id: 2}, {nome: "Kilo", id: 1}];

  constructor(
    private api: ApiService,
    private catService: CategoryService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.productForm = this.formBuilder.group({  
      'name' : [null, Validators.required],
      'description' : [null, Validators.required],
      'value' : [null, Validators.required],
      'typeValue' : [null, Validators.required],
      'stockQuantity' : [null, Validators.required],
      'imageUrl' : [null, Validators.required],
      'categoryId' : [null, Validators.required],
    });
  }

  getCategories(){
    this.catService.getCategories()
    .subscribe({
      next: (data) => {
        this.categories = data;
        console.log("Request completed: get categories (product-create)");
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  createProduct(){
    const product = this.productForm?.value;
    console.log(product);

    this.api.addproduct(product)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.log(err);
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
