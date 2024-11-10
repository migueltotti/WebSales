import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardHeader, MatCardContent, MatCardActions, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDivider } from '@angular/material/divider';
import { UserService } from '../../services/user.service';
import { DatePipe } from '@angular/common';
import { BrlPipe } from '../../app/extensions/valuePipe'
import { User } from '../../models/user';
import { CdkTableDataSourceInput } from '@angular/cdk/table';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { HttpHeaders } from '@angular/common/http';
import { PaginationInfo } from '../../models/paginationInfo';
import { PageEvent } from '@angular/material/paginator';
import { switchMap } from 'rxjs';

const userTest = new User(
  1,
  'Miguel Totti de Oliveira',
  'migueltotti2005@gmail.com',
  'Testemiguel18@',
  '111.111.111-11',
  110,
  '10/10/2005',
  2,
  2,
);

const ordersTest = [
  new Order(1, 100, '11/10/2024', 3, 8),
  new Order(3, 34, '10/10/2024', 3, 3),
  new Order(2, 89.90, '09/10/2024', 2, 3),
  new Order(23, 1231, '09/10/2024', 1, 4),
  new Order(23, 1231, '09/10/2024', 1, 4),
  new Order(23, 1231, '09/10/2024', 1, 4),
  new Order(23, 1231, '09/10/2024', 1, 4),
  new Order(23, 1231, '09/10/2024', 1, 4),
  new Order(23, 1231, '09/10/2024', 1, 4),
  new Order(23, 1231, '09/10/2024', 1, 4),
  new Order(23, 1231, '09/10/2024', 1, 4),
  new Order(23, 1231, '09/10/2024', 1, 4),
  new Order(23, 1231, '09/10/2024', 1, 4),
]

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardSubtitle,
    MatCardTitle,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatDivider,
    DatePipe,
    BrlPipe
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  user: User | undefined;
  userId: number = 0;
  email: string | undefined;

  // Users Orders
  displayedColumns = ['orderId', 'totalValue', 'orderDate', 'orderStatus'];
  orders: Order[] | undefined;

  roles = new Map([
    [0, "Customer"],
    [1, "Employee"],
    [2, "Admin"],
  ]);
  
  status = new Map([
    [1, "Preparing"],
    [2, "Sent"], 
    [3, "Finished"]
  ]);

  affiliates = new Map([
    [1, "Nenhuma Afiliação"],
    [2, "Duratex"],
    [3, "Bhrama"],
  ]);

  gridCols: number = 5; // Defau
  gridRowHeight: number = 85;

  // Pagination
  paginationInfo: PaginationInfo | undefined;

  length: number | undefined;
  pageSize: number | undefined;
  pageIndex: number | undefined;
  pageSizeOptions = [5, 10, 25, 50];

  pageEvent: PageEvent | undefined;

  constructor(
    private userServ: UserService,
    private orderServ: OrderService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.email = sessionStorage.getItem('email')!;
    //this.email = userTest.email;


    this.userServ.getUserByEmail(this.email)
    .pipe(
      switchMap(user => {
        this.user = user;
        console.log(this.user);
        return this.orderServ.getOrdersByUserId(user.userId);
      })
    ).subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log(this.orders);
      },
      error: (err) => {
        console.log(err);
      }
    });
    
    //this.user = userTest;
    //this.orders = ordersTest;

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.gridCols = 1;
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.gridCols = 2;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.gridCols = 3;
          this.gridRowHeight = 65;
        } else {
          this.gridCols = 5; // Large and up
          this.gridRowHeight = 85;
        }
      }
    });

  }

  editUser() {
    // Lógica para editar usuário
  }

  deleteUser() {
    // Lógica para deletar usuário
  }

  goToAccountSettings() {
    // Navegar para a página de configurações
  }

  viewWishlist() {
    // Navegar para a lista de desejos do usuário
  }
}
