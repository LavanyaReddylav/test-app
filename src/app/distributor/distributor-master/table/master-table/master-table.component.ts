import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { ConfirmationComponent } from 'src/app/shared/modal/confirmation/confirmation.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { DistributorData } from '../../../model/distributor-model';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { DistributorService } from '../../../service/distributor.service';


@Component({
    selector: 'master-table',
    templateUrl: './master-table.component.html',
    styleUrls: ['./master-table.component.scss']
})
export class MasterTableComponent implements OnInit, AfterViewInit {

    @Input() distributors: DistributorData[];

    @Output() successEvent = new EventEmitter();

    // displayed columns for the usertable
    displayedColumns: string[] = ['select', 'name', 'mobile', 'active', 'sap_code', 'sales_office', 'gtm_city', 'division', 'dc'];
    dataSource: MatTableDataSource<DistributorData>;
    selection = new SelectionModel<DistributorData | any>(true, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(public dialog: MatDialog, private cdref: ChangeDetectorRef, private _distributor: DistributorService) {

        // Assign the data to the data source for the table to render.
        this.dataSource = new MatTableDataSource()
    }

    //Remove Distributor Mapping.
    removeDistributorMapping(): void {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
            width: '450px',
            data: { title: 'Are you sure?', content: `That you want to remove all the distributor mappings? For selected Distributors, This process can't be undone.` }
        });
        dialogRef.afterClosed().subscribe(value => {
            if (value == true) {
                var distributors = this.selection.selected;
                distributors = distributors.map(d => d.sap_code);
                this._distributor.removeDistributorMapping({ distributors }).subscribe(
                    res => {
                        this.successEvent.emit();
                        this.dialog.open(SuccessComponent, {
                            width: '450px',
                            data: { title: 'Success!', content: res.message }
                        });
                    },//res.
                    err => {
                        this.dialog.open(FailureComponent, {
                            width: '350px',
                            data: { title: 'Failure!', content: `${err.error.message}` }
                        });
                    }//err.
                );//subscribe.
            }//if.
        });

    }//removeDistributorMapping.


    //Activate Distributors.
    activateDistributors(active) {
        var distributors = this.selection.selected;
        distributors = distributors.map(d => d._id);
        const state = { distributors, active };
        this._distributor.activateDistributor(state).subscribe(
            res => {
                this.successEvent.emit();
                this.dialog.open(SuccessComponent, {
                    width: '450px',
                    data: { title: 'Success!', content: `Selected Distributors updated Successfully.` }
                });
            },
            err => {
                this.dialog.open(FailureComponent, {
                    width: '350px',
                    data: { title: 'Failure!', content: `${err.error.message}` }
                });
            },
        );

    }//activate distributors.

    /** Whether the number of selected elements matches the total number of rows. */
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

    openConfirmationModal(): void {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
            width: '450px',
            data: { title: 'Are you sure?', content: `Do you really want to delete these records? This process can't be undone.` }
        });

        dialogRef.afterClosed().subscribe(value => {
            console.log(value);
            value == true ? this.dialog.open(SuccessComponent, {
                width: '450px',
                data: { title: 'Success!', content: `Selected distributors Deleted Successfully.` }
            }) : console.log(`confirmation dialog was closed`)
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = this.distributors;
        this.cdref.detectChanges();
    }

    ngOnInit() {

    }
    selectDistributors() {

    }
}



