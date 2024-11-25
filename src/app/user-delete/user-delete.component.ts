import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { SnackbarService } from '../../services/snackbar.service';

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
  selector: 'app-user-delete',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    RouterLink
  ],
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.scss'
})
export class UserDeleteComponent implements OnInit {

  userId: number = 0;
  user: User | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userServ: UserService,
    private snackBar: SnackbarService
  ){}

  ngOnInit(){
    this.userId = this.route.snapshot.params['id'];
    this.userServ.getUserById(this.userId)
    .subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('user request completed!');
      }
    });
    //this.user = userTest;
  }

  confirmDelete(){
    this.userServ.deleteUser(this.userId)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.deleteUserAuth();
        this.router.navigate(['/home']);
        this.snackBar.openSuccessSnackBar('User Deleted Successfuly');
      },
      error: (err) => {
        console.log(err);
        this.snackBar.openErrorSnackBar('Unable to delete User! Try again later');
      },
      complete: () => {
        console.log('request completed: deleteUser');
      }
    })
  }

  deleteUserAuth(){
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('email');
  }
}
