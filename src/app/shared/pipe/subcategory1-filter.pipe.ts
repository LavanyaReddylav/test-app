import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'subcategory1'
})
export class Subcategory1Pipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText.length) return items;

        return items.filter(it => {
            return searchText.indexOf(it.category) != -1;
        });
    }
}