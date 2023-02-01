import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  pure: true
})
export class FileSizePipe implements PipeTransform {

  private units = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  transform(bytes: number = 0): string {
    if ( isNaN( parseFloat( String(bytes) )) || ! isFinite( bytes ) ) {
      return '?'
    }
    
    let unit = 0;
    let precision:number = 2 

    while ( bytes >= 1024 ) {
      bytes /= 1024;
      unit ++;
    }

    return bytes.toFixed( + precision ) + ' ' + this.units[ unit ];
  }
}