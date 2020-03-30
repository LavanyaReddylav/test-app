import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: [string]): any[] {
        if (!items) return [];
        if (!searchText.length) return items;

        return items.filter(it => {
            return searchText.indexOf(it.sales_office) != -1;
        });
    }
} 