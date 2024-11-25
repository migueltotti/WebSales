import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackBarComponent } from '../app/snack-bar/success-snack-bar/success-snack-bar.component';
import { FailedSnackBarComponent } from '../app/snack-bar/failed-snack-bar/failed-snack-bar.component';

const snackBarDurantionInSeconds = 5;

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  openSuccessSnackBar(successMessage: String) {
    this.snackBar.openFromComponent(SuccessSnackBarComponent, {
      data: successMessage,
      duration: snackBarDurantionInSeconds * 1000,
      panelClass: 'success-snackbar'
    });
  }

  openErrorSnackBar(errorMessage: String) {
    this.snackBar.openFromComponent(FailedSnackBarComponent, {
      data: errorMessage,
      duration: snackBarDurantionInSeconds * 1000,
      panelClass: 'error-snackbar'
    });
  }
}
