import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sku'
})
export class SkuPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText.length) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            if (it.sku_code.toLowerCase().includes(searchText) || it.category.toLowerCase().includes(searchText) || it.subcategory1.toLowerCase().includes(searchText) || it.material_group.toLowerCase().includes(searchText) || it.dvcode.toLowerCase().includes(searchText) || it.division.toLowerCase().includes(searchText) || it.sku.toLowerCase().includes(searchText))
                return true;
            else return false;
        });
    }
}