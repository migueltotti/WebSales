import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { UserComponent } from './user/user.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductDeleteComponent } from './product-delete/product-delete.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';

export const routes: Routes = [
    {
        path: 'login',
        title: 'Login page',
        component: LoginComponent
    },
    {
        path: 'home',
        title: 'Home page',
        component: HomeComponent
    },
    {
        path: 'products',
        title: 'Products page',
        component: ProductsComponent
    },
    {
        path: 'product/:id',
        title: 'Product detail',
        component: ProductDetailsComponent
    },
    {
        path: 'product-create',
        title: 'Products create',
        component: ProductCreateComponent
    },
    {
        path: 'product-edit/:id',
        title: 'Product edit',
        component: ProductEditComponent
    },
    {
        path: 'product-delete/:id',
        title: 'Product delete',
        component: ProductDeleteComponent
    },
    {
        path: 'orders',
        title: 'Orders page',
        component: OrdersComponent
    },
    {
        path: 'user',
        title: 'User info page',
        component: UserComponent
    },
    {
        path: 'user-edit/:id',
        title: 'User edit',
        component: UserEditComponent
    },
    {
        path: 'user-delete/:id',
        title: 'User delete',
        component: UserDeleteComponent
    },
    { 
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];
