import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '../user.service';
import { of, merge } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { GithubIssue } from '../github-api';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { IssueDialogComponent } from './issue-dialog/issue-dialog.component';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements AfterViewInit {

  displayedColumns: string[] = ['number', 'created', 'state', 'title', 'comments', 'menu'];
  dataSource: MatTableDataSource<GithubIssue>;

  constructor(private userService: UserService, public dialog: MatDialog) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  title = 'Github 中 Angular 问题列表'
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  dicMap: any = { 'open': '打开', 'closed': '关闭' };

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.userService.getRepoIssues(
            this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return of([]);
        })
      ).subscribe(data => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTotalComments() {
    return this.dataSource?.data.map(t => +t.comments).reduce((acc, value) => acc + value, 0);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.menuColumns, event.previousIndex, event.currentIndex);
  }

  menuColumns = [
    { id: 'number', hide: true },
    { id: 'created', hide: true },
    { id: 'state', hide: true },
    { id: 'title', hide: true },
    { id: 'comments', hide: true },
    { id: 'menu', hide: true }
  ]

  getMenuColumns(): string[] {
    return this.menuColumns.filter(item => item.hide).map(item => item.id);
  }

  hideColumns(event: MatCheckboxChange) {
    const colName = event.source.name;
    const checked = event.checked;
    console.log(colName, checked);

    let index = this.menuColumns
      .map(item => item.id)
      .indexOf(colName);
    this.menuColumns[index].hide = checked;

    this.displayedColumns = this.menuColumns
      .filter(item => item.hide)
      .map(item => item.id);
  }

  openDialog(githubIssue: GithubIssue): void {
    const dialogRef = this.dialog.open(IssueDialogComponent, {
      width: '300px',
      data: githubIssue
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
