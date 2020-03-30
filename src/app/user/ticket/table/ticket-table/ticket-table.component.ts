import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/user/service/user.service';
import { normalizeStyles } from '@angular/animations/browser/src/util';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';

@Component({
  selector: 'user-ticket-table',
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TicketTableComponent implements OnInit {


  @Input() tickets: TicketData[];
  @Output() successEvent = new EventEmitter();

  updateStatusForm: FormGroup;
  status: string[];
  // ticketStatus: TicketStatus[] = [{ value: 'pending', viewValue: 'Pending' }, { value: 'resolved', viewValue: 'Resolved' }, { value: 'aborted', viewValue: 'Aborted' }];


  displayedColumns: string[] = ['TicketNo', 'SalesOffice', 'GtmCity', 'Division', 'DC', 'Loginid', 'UserName', 'Type', 'status'];
  dataSource: MatTableDataSource<TicketData>;
  expandedElement: TicketData;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private cdref: ChangeDetectorRef, private fb: FormBuilder, private _user: UserService) {

    this.dataSource = new MatTableDataSource();

  }

  changeStatus(row, status) {
    this._user.modifyTicket({ _id: row['TicketID'], status }).subscribe(
      res => {
        this.dialog.open(SuccessComponent, {
          width: '450px',
          data: { title: 'Success!', content: `${res.message}` }
        });
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  panelColor;
  // encapsulation: ViewEncapsulation.None,
  ngOnInit() {
    this.status = ['Open', 'Work In Progress', 'Closed'];
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.tickets;
    this.cdref.detectChanges();
  }


}

export class TicketData {

  UserName: string
  Loginid: string
  SalesOffice: string
  GtmCity: string
  Division: string
  DC: string
  Type: string
  Remarks: string
  TicketID: string
  TicketNo: string
  Image: string
  Date: string
  Time: string
  status: string
  UpdatedOn: string
  UpdatedOnTime: string
}
