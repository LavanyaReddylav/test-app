import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, Input, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { ConfirmationComponent } from 'src/app/shared/modal/confirmation/confirmation.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { UserData } from 'src/app/user/model/user-model';
import { UserService } from '../../../service/user.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { ModifyUserComponent } from '../../modal/modify-user/modify-user.component';




@Component({
    selector: 'user-master-table',
    templateUrl: './master-table.component.html',
    styleUrls: ['./master-table.component.scss']
})
export class MasterTableComponent implements OnInit, AfterViewInit {

    @Input() users: UserData[];

    @Output() successEvent = new EventEmitter();

    // displayed columns for the usertable
    displayedColumns: string[] = ['select', 'name', 'emp_code', 'mobile', 'active', 'loginid', 'sales_office', 'gtm_city', 'division', 'dc', 'weekly_off', 'joining_date'];
    dataSource: MatTableDataSource<UserData>;
    selection = new SelectionModel<UserData | any>(true, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(public dialog: MatDialog, private cdref: ChangeDetectorRef, private _user: UserService) {
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource();
    }

    //Activate Users.
    activateUsers(active) {
        var users = this.selection.selected;
        users = users.map(u => u._id);
        const state = { users, active };
        this._user.activateUser(state).subscribe(
            res => {
                this.successEvent.emit();
                this.dialog.open(SuccessComponent, {
                    width: '450px',
                    data: { title: 'Success!', content: `Selected Users updated Successfully.` }
                });
            },
            err => {
                this.dialog.open(FailureComponent, {
                    width: '350px',
                    data: { title: 'Failure!', content: `${err.error.message}` }
                });
            },
        );
    }//activateUsers.

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

    // openConfirmationModal(): void {
    //     var user = this.selection.selected;
    //     user = user.map(i => i._id);
    //     console.log(user)
    //     const dialogRef = this.dialog.open(ConfirmationComponent, {
    //         width: '450px',
    //         data: { title: 'Are you sure?', content: `Do you really want to delete these records? This process can't be undone.` }
    //     });

    //     dialogRef.afterClosed().subscribe(value => {
    //         this._user.deleteUser(user).subscribe(res => {
    //             this.successEvent.emit();
    //             console.log(res)
    //             console.log(value);
    //             value == true ? this.dialog.open(SuccessComponent, {
    //                 width: '450px',
    //                 data: { title: 'Success!', content: `Selected users Deleted Successfully.` }
    //             }) : console.log(`confirmation dialog was closed`)
    //         }, err => {
    //             console.log(err)
    //         })
    //     });
    // }

    //edit user

    modifyUser(user): void {

        const dialogRef = this.dialog.open(ModifyUserComponent, {
            width: '650px',
            data: user
        });

        dialogRef.afterClosed().subscribe(userForm => {
            // console.log(userForm);
        });
    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = this.users;
        this.cdref.detectChanges();
    }


    selectUsers() {

    }

}//class end.

