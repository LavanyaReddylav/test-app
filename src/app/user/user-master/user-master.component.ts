import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatDialog, MatOption } from '@angular/material';
import { AdduserComponent } from './modal/adduser/adduser.component';
import { UserService } from '../service/user.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { DataService } from 'src/app/shared/service/data.service';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'user-master',
    templateUrl: './user-master.component.html',
    styleUrls: ['./user-master.component.scss']
})
export class UserMasterComponent implements OnInit {

    baseUrl: string = environment.uri;

    // @ViewChild('AllSalesOffice') private AllSalesOffice: MatOption;
    // @ViewChild('AllGtmCity') private AllGtmCity: MatOption;
    // @ViewChild('AllDivision') private AllDivision: MatOption;

    filterForm: FormGroup;
    users;
    progressValue: number = 0;
    showTable: boolean = false;
    showUpload: boolean = false;
    uploadForm: FormData;
    error: any;
    DownloadFormat: boolean = false;

    //selected options for the filter
    division: string[];
    sales_office: string[];
    gtm_city: string[];
    dcList: string[];
    userStatus: UserStatus[] = [{ value: '', viewValue: 'All' }, { value: true, viewValue: 'Active' }, { value: false, viewValue: 'InActive' }];

    constructor(public dialog: MatDialog, private fb: FormBuilder, private _user: UserService, private _data: DataService, private excel: ExcelService) { }

    //Download format.
    downloadFormat() {
        this.DownloadFormat = true;
    }

    //open add new user form.
    openDialog(): void {
        const dialogRef = this.dialog.open(AdduserComponent, {
            width: '650px',
        });

        dialogRef.afterClosed().subscribe(userForm => {
            // console.log(userForm);
        });
    }

    uploadEvent(file: File) {
        this.uploadForm = new FormData();
        this.uploadForm.append('excel', file);

        this._user.uploadUsers(this.uploadForm).subscribe(
            (event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        this.progressValue = (event.loaded / event.total) * 100;
                        break;
                    case HttpEventType.Response:
                        this.dialog.open(SuccessComponent, {
                            width: '550px',
                            data: { title: 'Success!', content: `Users Uploaded Successfully.` }
                        })
                }//switch case.
            },//event ends.
            err => {
                this.error = err;
                this.dialog.open(FailureComponent, {
                    width: '350px',
                    data: { title: 'Failure!', content: `${err.error.message}` }
                });
            }); //err , subscribe ends.

    };//uploadEvent ends.

    selectEvent(file: File): void {
        this.progressValue = 0;
    }

    cancelEvent(): void {
        this.progressValue = 0;
    }

    // All
    toggleAllSelection(selected, formControlName) {
        if (selected) {
            switch (formControlName) {
                case 'sales_office':
                    this.filterForm.controls[formControlName].patchValue(this[formControlName]);
                    break;
                case 'gtm_city':
                    this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.name));
                    break;
                case 'division':
                    this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
            }
        }
        else {
            this.filterForm.controls[formControlName].patchValue([]);
        }
    }

    //Load Users.
    loadUsers() {
        this.users = null;
        this.showTable = true;
        this._user.getUsers(this.filterForm.value).subscribe(
            res => {
                this.users = res;
            },
            err => {
                this.dialog.open(FailureComponent, {
                    width: '350px',
                    data: { title: 'Failure!', content: `${err.error.message}` }
                });
                this.showTable = false;
            }
        );
    }//load users

    //Export Users.
    exportAsExcel() {
        const data = this.users.map((item: any) => {
            return {
                'Name': item.name,
                'Mobile': item.mobile,
                'Loginid': item.loginid,
                'Email': item.email,
                'Active': item.active,
                'Sales Office': item.sales_office.join(', '),
                'Gtm City': item.gtm_city.join(', '),
                'Distribution Channel': item.dc.join(', '),
                'Division': item.division.join(', '),
                'Weekly Off': item.weekly_off.join(', '),
                'Joining Date': item.joining_date.map(i => i.split('T')[0]).join(', '),
                'Employee Code': item.emp_code
            }
        });
        this.excel.exportAsExcelFile(data, 'users');
    }

    ngOnInit() {
        this.filterForm = this.fb.group({
            sales_office: [[]],
            gtm_city: [[]],
            division: [[]],
            dc: [[]],
            active: ['']
        });
        this.division = JSON.parse(localStorage.divisionList);
        this.sales_office = JSON.parse(localStorage.salesOfficeList);
        this.gtm_city = JSON.parse(localStorage.gtmCityList);
        this.dcList = JSON.parse(localStorage.dcList);
    }

}

export interface UserStatus {
    value: boolean | string;
    viewValue: string;
}
