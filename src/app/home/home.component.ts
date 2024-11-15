import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    NgFor,
    MatButton
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  currentIndex = 0;
  items = [{ title: 'Item 1' }, { title: 'Item 2' }, { title: 'Item 3' }, { title: 'Item 4' }, { title: 'Item 5' }, { title: 'Item 6' }, { title: 'Item 7' }, { title: 'Item 8' }, { title: 'Item 9' }];

  getTransform() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    }
  }

}
