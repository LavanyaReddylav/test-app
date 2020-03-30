import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BeatSchedule } from 'src/app/beat/model/beatSchedule-model';

@Component({
    selector: 'schedule-table',
    templateUrl: './schedule-table.component.html',
    styleUrls: ['./schedule-table.component.scss']
})
export class ScheduleTableComponent implements OnInit {

    @Input() beatSchedules: BeatSchedule[];
    @Output() successEvent = new EventEmitter();

    displayedColumns: string[] = ['select', 'name', 'user', 'beat', 'date'];
    dataSource: MatTableDataSource<BeatSchedule>;
    selection = new SelectionModel<BeatSchedule | any>(true, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;



    constructor(private cdref: ChangeDetectorRef) {
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource();
    }


    selectBeats() {

    }

    activateBeats() {

    }
    openConfirmationModal() {

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

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = this.beatSchedules;
        this.cdref.detectChanges();
    }

}

