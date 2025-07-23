import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlannerService } from '../../shared/services/planner.service';
import { ITable } from '../../shared/facades/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  tableForm = this.fb.nonNullable.group({
    id: this.fb.nonNullable.control(this.generateUniqueId()),
    name: this.fb.nonNullable.control('', Validators.required),
    capacity: this.fb.nonNullable.control(null, Validators.required),
  });
  isSubmitted = signal(false);

  getControl(controlName: string): AbstractControl<any, any> {
    return this.tableForm.get(controlName) as AbstractControl<any, any>;
  }
  constructor(
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    public data: {},
    private fb: FormBuilder,
    private plannerService: PlannerService,
    private toastr: ToastrService
  ) {}

  close(data?: boolean): void {
    this.dialogRef.close(data);
  }

  onSubmit() {
    this.isSubmitted.set(true);
    if (this.tableForm.invalid) {
      return; // Prevent submission
    }

    const table = this.tableForm.getRawValue() as ITable;
    this.plannerService.addTable(table);
    this.toastr.success('Table added successfully!');
    this.close();
  }
  generateUniqueId(): string {
    return Date.now().toString();
  }
}
