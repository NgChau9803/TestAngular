import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([
    {
      id: '1',
      title: 'Learn Angular',
      description: 'Complete Angular tutorial',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdAt: new Date()
    }
  ]);

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getTaskById(id: string): Observable<Task | undefined> {
    const tasks = this.tasksSubject.value;
    return of(tasks.find(task => task.id === id));
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: this.generateUniqueId(),
      createdAt: new Date()
    };

    const currentTasks = this.tasksSubject.value;
    const updatedTasks = [...currentTasks, newTask];
    this.tasksSubject.next(updatedTasks);

    return of(newTask);
  }

  updateTask(updatedTask: Task): Observable<Task> {
    const currentTasks = this.tasksSubject.value;
    const index = currentTasks.findIndex(t => t.id === updatedTask.id);

    if (index !== -1) {
      const newTasks = [...currentTasks];
      newTasks[index] = updatedTask;
      this.tasksSubject.next(newTasks);
      return of(updatedTask);
    }

    return of(updatedTask);
  }

  deleteTask(taskId: string): Observable<boolean> {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter(task => task.id !== taskId);
    
    this.tasksSubject.next(filteredTasks);
    return of(true);
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}