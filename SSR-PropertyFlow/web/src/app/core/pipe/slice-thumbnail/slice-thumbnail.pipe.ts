import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceThumbnail',
  pure: true
})
export class SliceThumbnailPipe implements PipeTransform {
    
  constructor() { }

  transform(value:string) {
    
    if(value){
        let valueX = value.split(' ');
        value = ((valueX[0] ? valueX[0].substring(0, 1) : '') + (valueX[1] ? valueX[1].substring(0, 1) : '')).toUpperCase();
    }

    return value;
  }
}