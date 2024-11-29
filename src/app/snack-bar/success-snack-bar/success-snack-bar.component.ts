import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-success-snack-bar',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatSnackBarLabel, 
    MatSnackBarAction
  ],
  templateUrl: './success-snack-bar.component.html',
  styleUrl: './success-snack-bar.component.scss'
})
export class SuccessSnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string){}
}
