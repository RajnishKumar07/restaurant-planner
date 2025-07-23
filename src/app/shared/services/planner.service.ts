import { Injectable, effect, signal } from '@angular/core';
import { ITable } from '../facades/table';
import { IReservation } from '../facades/reservation';

const TABLE_STORAGE_KEY = 'planner_tables';
const RESERVATION_STORAGE_KEY = 'planner_reservations';

@Injectable({ providedIn: 'root' })
export class PlannerService {
  allTable = signal<ITable[]>([]);
  allReservations = signal<IReservation[]>([]);

  constructor() {
    // Load from localStorage on app start
    const storedTables = localStorage.getItem(TABLE_STORAGE_KEY);
    const storedReservations = localStorage.getItem(RESERVATION_STORAGE_KEY);

    if (storedTables) {
      try {
        this.allTable.set(JSON.parse(storedTables));
      } catch {
        console.warn('Failed to parse saved tables');
      }
    }

    if (storedReservations) {
      try {
        this.allReservations.set(JSON.parse(storedReservations));
      } catch {
        console.warn('Failed to parse saved reservations');
      }
    }

    // Auto-sync to localStorage when signals change
    effect(() => {
      localStorage.setItem(TABLE_STORAGE_KEY, JSON.stringify(this.allTable()));
    });

    effect(() => {
      localStorage.setItem(
        RESERVATION_STORAGE_KEY,
        JSON.stringify(this.allReservations())
      );
    });
  }

  addTable(table: ITable) {
    this.allTable.update((tables) => [...tables, table]);
  }

  addReservation(reservation: IReservation) {
    this.allReservations.update((res) => [...res, reservation]);
  }

  findBestAvailableTable(
    startTimeISO: string,
    endTimeISO: string,
    requiredCapacity: number
  ): ITable | null {
    const startTime = new Date(startTimeISO).getTime();
    const endTime = new Date(endTimeISO).getTime();

    const reservations = this.allReservations();
    const tables = this.allTable();

    const filteredTables = tables
      .filter((t) => Number(t.capacity) >= requiredCapacity)
      .sort((a, b) => Number(a.capacity) - Number(b.capacity)); // best fit first

    for (const table of filteredTables) {
      const isOccupied = reservations.some(
        (r) =>
          r.tableId === table.id &&
          this.isTimeOverlap(
            startTime,
            endTime,
            new Date(r.startTime).getTime(),
            new Date(r.endTime).getTime()
          )
      );

      if (!isOccupied) return table;
    }

    return null;
  }

  private isTimeOverlap(
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): boolean {
    return start1 < end2 && start2 < end1;
  }
}
