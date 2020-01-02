import { Component, OnInit, ViewChild } from '@angular/core';
import { DownstreamService } from './downstream.service';
import { CreditModel } from './credit-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TotalByLocation } from './total-by-location';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AppComponent implements OnInit {

  creditTotal: number = 0;
  debitTotal: number = 0;
  totalByLocation: TotalByLocation[];
  totalAmount: number;
  selectedTotal: number;

  displayedColumns: string[] = ['date', 'location', 'debit', 'credit'];
  dataSource: MatTableDataSource<CreditModel>;

  expandDataSource: MatTableDataSource<TotalByLocation>;
  expandTableColumns: string[] = ['location', 'credit', 'debit'];
  expandedElement: TotalByLocation | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private app: DownstreamService) { }

  ngOnInit() {

    this.app.getCreditData().subscribe(
      resp => {
        this.dataSource = new MatTableDataSource(resp.body);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );

    this.app.getCreditMap().subscribe(
      resp => {
        this.totalByLocation = resp.body;
        this.expandDataSource = new MatTableDataSource(resp.body);
        console.log(this.totalByLocation);
        this.totalAmount = this.totalByLocation.find(entry => entry.location == 'TOTAL').creditTotal;
      }
    );


  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getTotalCost();

  }

  getTotalCost() {
    var filteredData = this.dataSource.filteredData;
    this.creditTotal = filteredData.map(row => +row.credit).reduce((a, b) => a + b, 0);
    this.debitTotal = filteredData.map(row => +row.debit).reduce((a, b) => a + b, 0);
  }

  addTotal(list) {
    this.selectedTotal = list.selectedOptions.selected.map(item => item.value.creditTotal).reduce((a, b) => a + b, 0);
  }

}
