import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'subcategory2'
})
export class Subcategory2Pipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText.length) return items;

        return items.filter(it => {
            return searchText.indexOf(it.subcategory1) != -1;
        });
    }
}