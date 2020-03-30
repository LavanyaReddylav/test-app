import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SalesData } from '../../../model/sale.model';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'report-table',
    templateUrl: './report-table.component.html',
    styleUrls: ['./report-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class ReportTableComponent implements OnInit {

    @Input() sales: SalesData[];

    displayedColumns: string[] = ['select', 'date', 'user', 'sku_code', 'quantity', 'counter_code', 'division', 'dc', 'msm', 'order_placed', 'order-id'];
    dataSource: MatTableDataSource<SalesData>;
    selection = new SelectionModel<SalesData | any>(true, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private cdref: ChangeDetectorRef) {
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource();
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
    selectSales() {

    }
    activateSale() {

    }
    deactivateSale() {

    }
    openConfirmationModal() {

    }
    ngOnInit() { }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = this.sales;
        this.cdref.detectChanges();
    }

}

