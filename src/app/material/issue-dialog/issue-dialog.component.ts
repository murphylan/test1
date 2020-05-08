import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GithubIssue } from '../../github-api'

@Component({
  selector: 'app-issue-dialog',
  templateUrl: './issue-dialog.component.html',
  styleUrls: ['./issue-dialog.component.css']
})
export class IssueDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<IssueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GithubIssue) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
