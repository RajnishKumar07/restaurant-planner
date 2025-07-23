import { Component, Inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { IReservation } from '../../shared/facades/reservation';
import { PlannerService } from '../../shared/services/planner.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {
  isSubmitted = signal(false);

  hours = Array.from(
    { length: 24 },
    (_, i) => i.toString().padStart(2, '0') + ':00'
  );

  selectedTime = signal<string | null>(null);
  selectedDate!: Date;
  reservationForm = this.fb.group({
    id: this.fb.nonNullable.control(this.generateUniqueId()),
    customerName: this.fb.nonNullable.control('', Validators.required),
    numberOfPerson: this.fb.nonNullable.control('', [Validators.required]),
    startTime: this.fb.nonNullable.control('', Validators.required),
    endTime: this.fb.nonNullable.control('', Validators.required), // Optional: pre-fill end time + 1hr
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: DialogRef,
    private plannerService: PlannerService,
    private toastr: ToastrService,
    @Inject(DIALOG_DATA) public data: { selectedDate: Date }
  ) {
    if (data?.selectedDate) {
      this.selectedDate = data.selectedDate;
    }
  }

  getControl(controlName: string): AbstractControl {
    return this.reservationForm.get(controlName) as AbstractControl;
  }

  onSelectTime(hour: string) {
    this.selectedTime.set(hour);

    const [h, m] = hour.split(':').map(Number);

    // Set date with the selected hour
    const startDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate(),
      h,
      m,
      0,
      0
    );
    console.log('startDate---->', startDate, startDate.toISOString());

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1); // reservation for 1 hour
    console.log('endDate---->', endDate);

    this.reservationForm.patchValue({
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });
  }

  onSubmit() {
    console.log('submitted---', this.reservationForm.invalid);
    this.isSubmitted.set(true);
    if (this.reservationForm.invalid) return;

    const form = this.reservationForm.getRawValue();

    const bestTable = this.plannerService.findBestAvailableTable(
      form.startTime,
      form.endTime,
      Number(form.numberOfPerson)
    );

    if (!bestTable) {
      this.toastr.error('No available table for this time slot.');
      return;
    }

    const reservation: IReservation = {
      ...form,
      tableId: bestTable.id,
    };

    this.plannerService.addReservation(reservation);
    this.toastr.success(`Reservation created at ${bestTable.name}`);
    this.close(true);
  }

  close(data?: boolean): void {
    this.dialogRef.close(data);
  }

  generateUniqueId(): string {
    return Date.now().toString();
  }
}
