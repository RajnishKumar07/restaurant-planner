import { Component, OnInit } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { TableComponent } from '../table/table.component';
import { ReservationComponent } from '../reservation/reservation.component';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss',
})
export class PlannerComponent implements OnInit {
  currentSelectedDate = new Date();
  dialogRef!: DialogRef<any, any>;
  constructor(private dialog: Dialog) {}
  ngOnInit(): void {}

  openCreateTable() {
    this.dialogRef = this.dialog.open(TableComponent, {
      width: '30rem',
    });
  }

  openReservationAddModal() {
    this.dialogRef = this.dialog.open(ReservationComponent, {
      data: {
        selectedDate: this.currentSelectedDate,
      },
      width: '30rem',
    });
  }
}
