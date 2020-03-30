import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { ConfirmationComponent } from 'src/app/shared/modal/confirmation/confirmation.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { ProductData } from 'src/app/product/model/product-model';

@Component({
    selector: 'product-master-table',
    templateUrl: './master-table.component.html',
    styleUrls: ['./master-table.component.scss']
})
export class MasterTableComponent implements OnInit {

    @Input() products: ProductData[];

    displayedColumns: string[] = ['select', 'sku_code', 'division', 'dvcode', 'client_dv_code', 'material_group', 'sku', 'category', 'subcategory1', 'subcategory2'];
    dataSource: MatTableDataSource<ProductData>;
    selection = new SelectionModel<ProductData>(true, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(public dialog: MatDialog, private cdref: ChangeDetectorRef) {

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource();
    }

    selectProducts() {

    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    //Activate Products.
    activateProducts() {
        this.dialog.open(SuccessComponent, {
            width: '450px',
            data: { title: 'Success!', content: `Selected Products Activated Successfully.` }
        });

    }//activate Products.

    //Deactivate Products.
    deactivateProducts() {
        this.dialog.open(SuccessComponent, {
            width: '450px',
            data: { title: 'Success!', content: `Selected Products Deactivated Successfully.` }
        });

    }//Deactivate Products.


    openConfirmationModal(): void {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
            width: '450px',
            data: { title: 'Are you sure?', content: `Do you really want to delete these records? This process can't be undone.` }
        });

        dialogRef.afterClosed().subscribe(value => {
            console.log(value);
            value == true ? this.dialog.open(SuccessComponent, {
                width: '450px',
                data: { title: 'Success!', content: `Selected Products Deleted Successfully.` }
            }) : console.log(`confirmation dialog was closed`)
        });
    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = this.products;
        this.cdref.detectChanges();
    }


}
