import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MaterialRoutingModule } from './material-routing.module';
import { MaterialComponent } from './material.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { CustomMatPaginatorIntl } from './custom-mat-paginator-intl';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [MaterialComponent],
  imports: [
    CommonModule,
    MaterialRoutingModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatMenuModule,
    DragDropModule,
    MatCheckboxModule
  ],
  providers: [{
    provide: MatPaginatorIntl,
    useClass: CustomMatPaginatorIntl
  }]
})
export class MaterialModule { }
