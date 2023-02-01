import { Pipe, PipeTransform } from '@angular/core';

export interface IArrayFilter {
  value?: string;
  isSortable?: boolean;
  sortField?: string;
}

@Pipe({
  name: 'arrayFilter',
  pure: false
})
export class ArrayFilterPipe implements PipeTransform {

  transform(items: any[], data:IArrayFilter): any {
    if (!items || !data.value) {
        return items;
    }
    
    items = items.filter(x => x.InfoCode.toLowerCase() == data.value.toLowerCase());
    if(data.isSortable){
      items = items.sort((a,b) => a[data.sortField] ? a[data.sortField].toString().localeCompare(b[data.sortField].toString()) : false);
    }
    
    return items;
  }
}
