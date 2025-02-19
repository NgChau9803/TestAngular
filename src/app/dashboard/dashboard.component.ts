// src/app/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../core/services/task.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <div class="task-summary">
        <div class="task-card">
          <h3>Total Tasks</h3>
          <p>{{ (tasks$ | async)?.length }}</p>
        </div>
        <div class="task-card">
          <h3>In Progress</h3>
          <p>{{ (tasks$ | async)?.filter(t => t.status === 'IN_PROGRESS').length }}</p>
        </div>
        <div class="task-card">
          <h3>Completed Tasks</h3>
          <p>{{ (tasks$ | async)?.filter(t => t.status === 'DONE').length }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }
    .task-summary {
      display: flex;
      justify-content: space-between;
    }
    .task-card {
      background-color: #f4f4f4;
      border-radius: 5px;
      padding: 15px;
      text-align: center;
      width: 30%;
    }
  `]
})
export class DashboardComponent implements OnInit {
  tasks$: Observable<Task[]>;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks();
  }

  ngOnInit() {}
}