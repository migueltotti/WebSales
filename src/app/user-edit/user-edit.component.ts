import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormField, MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
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
  selector: 'app-user-edit',
  standalone: true,
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatButtonModule,
    MatIcon,
    NgFor,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditComponent implements OnInit {

  userId: number = 0;
  userForm: FormGroup | undefined;

  hide = true;

  affiliates = [
    {name: 'Nenhuma Afiliacao', id: 1},
    {name: 'Duratex', id: 2},
    {name: 'Bhrama', id: 3},
  ]

  constructor(
    private userServ: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(){
    this.getUser(this.route.snapshot.params['id']);

    this.userForm = this.formBuilder.group({  
      'userId': [null],
      'name' : [null, Validators.required],
      'email' : [null, Validators.required],
      'password' : [null, Validators.required],
      'cpf' : [null, Validators.required],
      'points' : [null, Validators.required],
      'dateBirth' : [null, Validators.required],
      'affiliateId' : [null, Validators.required],
      'role' : [null, Validators.required],
    });

    /*this.userForm?.setValue({
      userId: userTest.userId,
      name: userTest.name,
      email: userTest.email,
      password: userTest.password,
      cpf: userTest.cpf,
      points: userTest.points,
      dateBirth: this.formatDate(userTest.dateBirth),
      affiliateId: userTest.affiliateId,
      role: userTest.role
    });*/
  }

  getUser(id: number){
    this.userServ.getUserById(id).subscribe(res =>{
      //console.log(res);
      this.userId = res.userId;
      this.userForm?.setValue({
        userId: res.userId,
        name: res.name,
        email: res.email,
        password: res.password,
        cpf: res.cpf,
        points: res.role,
        dateBirth: res.dateBirth,
        affiliateId: res.affiliateId,
        role: res.role
      });
    });
  }

  updateUser() {
    const user = this.userServ.toUser(this.userForm!);
    console.log(user);
    
    this.userServ.updateUser(this.userId, user)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/user']);
        this.snackBar.openSuccessSnackBar('User Updated Successfuly');
      },
      error: (err) => {
        console.log(err);
        this.snackBar.openErrorSnackBar('Unable to update User! Try again later');
      },
      complete: () => {
        console.log('request completed: updateUser');
      }
    });
  }

  clickEvent() {
    if(this.hide){
      this.hide = false;
    }
    else{
      this.hide = true;
    }
  }

  formatDate(date: string) : String{
    var i = 0;
    var dateFormated = date.replaceAll('/', '-');
    var day = dateFormated.substring(0, 2);
    var month = dateFormated.substring(3, 5);
    var year = dateFormated.substring(6, 10);

    return year + '-' + month + '-'  + day;
  }
}
