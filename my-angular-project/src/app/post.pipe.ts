import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'post'
})
export class PostPipe implements PipeTransform {

  transform(value: string, limit: number = 100, trail: string = '..'): string {
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
