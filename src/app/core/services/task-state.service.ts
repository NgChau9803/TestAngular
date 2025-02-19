// src/app/core/services/task-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, scan, shareReplay } from 'rxjs/operators';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface TaskAction {
  type: 'ADD' | 'UPDATE' | 'DELETE';
  payload: Task;
}

@Injectable({
  providedIn: 'root'
})
export class TaskStateService {
  private actionSubject = new BehaviorSubject<TaskAction[]>([]);
  
  // Advanced state management using RxJS
  tasks$: Observable<Task[]> = this.actionSubject.pipe(
    scan((tasks: Task[], action: TaskAction) => {
      switch (action.type) {
        case 'ADD':
          return [...tasks, action.payload];
        case 'UPDATE':
          return tasks.map(task => 
            task.id === action.payload.id ? action.payload : task
          );
        case 'DELETE':
          return tasks.filter(task => task.id !== action.payload.id);
        default:
          return tasks;
      }
    }, []),
    shareReplay(1)
  );

  // Derived state
  completedTasks$ = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.status === 'DONE'))
  );

  addTask(task: Task) {
    this.actionSubject.next({
      type: 'ADD',
      payload: task
    });
  }

  updateTask(task: Task) {
    this.actionSubject.next({
      type: 'UPDATE',
      payload: task
    });
  }

  deleteTask(task: Task) {
    this.actionSubject.next({
      type: 'DELETE',
      payload: task
    });
  }
}