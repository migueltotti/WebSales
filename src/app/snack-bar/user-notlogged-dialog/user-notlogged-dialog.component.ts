import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-user-notlogged-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './user-notlogged-dialog.component.html',
  styleUrl: './user-notlogged-dialog.component.scss'
})
export class UserNotloggedDialogComponent {

}
