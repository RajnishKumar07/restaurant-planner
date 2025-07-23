import { PlannerService } from './../../shared/services/planner.service';
import { Component, computed, OnInit, ViewChild } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { TableComponent } from '../table/table.component';
import { ReservationComponent } from '../reservation/reservation.component';
import { CommonModule } from '@angular/common';
import {
  AgendaService,
  DayService,
  EventSettingsModel,
  GroupModel,
  MonthService,
  ResizeService,
  ResourceDetails,
  ScheduleComponent,
  ScheduleModule,
  TimelineMonthService,
  TimelineViewsService,
  View,
  WeekService,
  WorkWeekService,
} from '@syncfusion/ej2-angular-schedule';
import { extend } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, ScheduleModule], // ✅ Import module here
  providers: [
    DayService,
    TimelineViewsService,
    TimelineMonthService,
    ResizeService,
  ],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss',
})
export class PlannerComponent implements OnInit {
  public allTables = computed(() => {
    return [
      // {
      //   Id: 1753290285282,
      //   Text: 'Table 1',
      //   // GroupId: 1,
      //   Capacity: 1,
      // },
      // {
      //   id: 1753290285282,
      //   Text: 'Table 1',
      //   capacity: 4,
      // },
      ...this.plannerService.allTable().map((data) => {
        return {
          ...data,
          Id: Number(data.id),
        };
      }),
    ];
    // return [
    //   {
    //     name: 'Table 1',
    //     Id: 1753290285282,
    //     Capacity: 1,
    //   },
    //   {
    //     id: 1753290285282,
    //     name: 'Table 1',
    //     capacity: 4,
    //   },
    //   {
    //     id: 1753293332737,
    //     name: 'Table 2',
    //     capacity: 6,
    //   },
    //   {
    //     id: 1753293435344,
    //     name: 'Table 3',
    //     capacity: 4,
    //   },
    // ];
  });
  public allReservation = computed(() =>
    this.plannerService.allReservations().map((data) => {
      return {
        ...data,
        Subject: data.customerName,
        StartTime: new Date(data.startTime),
        EndTime: new Date(data.endTime),
        IsAllDay: false,
        IsBlock: false,
        tableId: Number(data.tableId),
      };
    })
  );

  @ViewChild('scheduleObj') public scheduleObj!: ScheduleComponent;
  public data: Record<string, any>[] = extend(
    [],
    this.allReservation(),
    undefined,
    true
  ) as Record<string, any>[];
  public selectedDate: Date = new Date();
  public currentView: View = 'TimelineDay';

  public group: GroupModel = {
    enableCompactView: false,
    resources: ['Customer'],
  };
  public allowMultiple = false;
  get eventSettings(): EventSettingsModel {
    return {
      dataSource: this.allReservation(),
    };
  }
  dialogRef!: DialogRef<any, any>;
  constructor(private dialog: Dialog, private plannerService: PlannerService) {}
  ngOnInit(): void {}

  openCreateTable() {
    this.dialogRef = this.dialog.open(TableComponent, {
      width: '30rem',
    });
  }

  openReservationAddModal() {
    this.dialogRef = this.dialog.open(ReservationComponent, {
      data: {
        selectedDate: this.selectedDate,
      },
      width: '30rem',
    });
  }
}
