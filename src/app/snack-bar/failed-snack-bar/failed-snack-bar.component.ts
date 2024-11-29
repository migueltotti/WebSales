import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-failed-snack-bar',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatSnackBarLabel, 
    MatSnackBarAction
  ],
  templateUrl: './failed-snack-bar.component.html',
  styleUrl: './failed-snack-bar.component.scss'
})
export class FailedSnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string){}
}
