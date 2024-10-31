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

  productId: string = '';
  nome: string = '';
  descricao: string = '';
  valor: string = '';
  tipoValor: string = '';
  quantidade: string = '';
  categoria: string = '';
  productForm: FormGroup | undefined;

  categories: Category[] = [];
  tipoValores = [{nome: "Unidade", id: 2}, {nome: "Kilo", id: 1}];

  isLoadingResults = false;

  constructor(
    private api: ApiService,
    private catServ: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(){
    this.getCategories();
    this.getProduct(this.route.snapshot.params['id']);
    this.productForm = this.formBuilder.group({
      'productId' : [null],  
      'nome' : [null, Validators.required],
      'descricao' : [null, Validators.required],
      'valor' : [null, Validators.required],
      'tipoValor' : [null, Validators.required],
      'quantidade' : [null, Validators.required],
      'categoria' : [null, Validators.required],
    });
  }

  getProduct(id: number){
    this.api.getProduct(id).subscribe(res =>{
      this.productId = res.productId;
      this.productForm?.setValue({
        productId: res.productId,
        nome: res.name,
        descricao: res.description,
        valor: res.value,
        tipoValor: res.typeValue,
        quantidade: res.stockQuantity,
        categoria: res.categoryId,
      });
    });
  }

  getCategories(){
    this.catServ.getCategories().subscribe(data =>{
      this.categories = data;
    });
  }

  // TODO: Resolver o problema do productId nao estar sendo reconhecido

  updateProduct(form: NgForm) {
    this.isLoadingResults = true;
    this.api.updateProduct(this.productId, form.value)
    .subscribe({
      next: (res) => {
        this.isLoadingResults = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.log(err);
        this.isLoadingResults = false;
      },
      complete: () => {
        console.log('request completed: updateProduct');
      }
    })
  }

  formatValue(){
    const valorControl = this.productForm!.get('valor');
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
