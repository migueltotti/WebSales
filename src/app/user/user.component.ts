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
  email: string | undefined;

  roles = new Map([
    [0, "Customer"],
    [1, "Employee"],
    [2, "Admin"],
  ]);

  affiliates = new Map([
    [1, "Nenhuma Afiliação"],
    [2, "Duratex"],
    [3, "Bhrama"],
  ]);

  // Users Orders
  displayedColumns = ['orderNumber', 'date', 'total'];
  userOrders!: CdkTableDataSourceInput<{ orderNumber: number; date: string; total: number; }>;

  gridCols: number = 5; // Defau
  gridRowHeight: number = 85;

  constructor(
    private userServ: UserService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    //this.email = sessionStorage.getItem('email')!;
    this.email = userTest.email;


    /*this.userServ.getUserByEmail(this.email)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.user = data;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('user received successfully');
      }
    });*/
    this.user = userTest;

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
