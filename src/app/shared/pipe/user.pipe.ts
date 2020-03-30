import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText.length) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            if (it.name.toLowerCase().includes(searchText) || it.loginid.toLowerCase().includes(searchText) || it.division.toString().toLowerCase().includes(searchText) || it.gtm_city.toString().toLowerCase().includes(searchText) || it.sales_office.toString().toLowerCase().includes(searchText))
                return true;
            else return false;
        });
    }
}