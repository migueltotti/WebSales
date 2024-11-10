import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'brlPipe',
})

export class BrlPipe implements PipeTransform {
  transform(value: number): string {
    return `R$ ${value}`;
  }
}