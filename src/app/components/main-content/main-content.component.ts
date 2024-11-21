import { Component, Input } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { LoginService } from 'src/app/shared/services/authorization/login.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { CustomerDataModel } from 'src/app/shared/models/customer-data.model';
import { UserRole } from 'src/app/shared/enums/user-role.enum';
import { ImportModalComponent } from '../modals/import-modal/import-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskModalComponent } from '../modals/add-task-modal/add-task-modal.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent {
  tasks: any;
  customerData: CustomerDataModel;
  displayedTasks: any[] = [];
  UserRole = UserRole;

  constructor(
    private loginService: LoginService,
    private dialog: MatDialog,
    private http: HttpClient,
    private tasksService: TasksService
  ) {}

  // Statuses for different roles
  developerStatuses = ['new', 'in_progress', 'in_review', 'blocked', 'done'];
  qaStatuses = [
    'ready_for_qa',
    'in_qa',
    'qa_passed',
    'preprod_passed',
    'deployed',
  ];

  selectedStatuses = this.developerStatuses; // Default to developer

  tasksList: { [key: string]: any[] } = {
    new: [],
    in_progress: [],
    in_review: [],
    blocked: [],
    done: [],
    ready_for_qa: [],
    in_qa: [],
    qa_passed: [],
    preprod_passed: [],
    deployed: [],
  };

  ngOnInit() {
    this.loginService.customerData$.subscribe((value) => {
      this.customerData = value;
      this.selectedStatuses =
        this.customerData.role === UserRole.Developer
          ? this.developerStatuses
          : this.qaStatuses;
      this.tasksService
        .getTasksByProjects(this.customerData._id)
        .subscribe((value) => {
          this.tasks = value.tasks;
          this.loadAllTasks(); // Load all tasks by default
        });
    });
  }

  loadAllTasks() {
    const allTasks = this.tasks?.flatMap((project) => project.tasks);
    this.resetTaskList();
    allTasks.forEach((task) => {
      const status = task.status as keyof typeof this.tasksList;
      if (this.tasksList[status]) {
        this.tasksList[status].push(task);
      }
    });
    this.displayedTasks = allTasks;
  }

  loadTasksForProject(projectId: string, taskType: string) {
    if (projectId === 'all') {
      this.loadAllTasks();
      return;
    }
    const selectedProject = this.tasks.find(
      (project) => project.project_id === projectId
    );
    if (!selectedProject) return;
    const tasks = selectedProject.tasks.filter((task) => {
      switch (taskType) {
        case 'important':
          return task.is_important;
        case 'completed':
          return task.is_completed;
        case 'incompleted':
          return !task.is_completed;
        default:
          return true;
      }
    });

    this.resetTaskList();
    tasks.forEach((task) => {
      const status = task.status as keyof typeof this.tasksList;
      if (this.tasksList[status]) {
        this.tasksList[status].push(task);
      }
    });
    this.displayedTasks = tasks;
  }

  private resetTaskList() {
    Object.keys(this.tasksList).forEach((key) => {
      this.tasksList[key as keyof typeof this.tasksList] = [];
    });
  }

  onProjectSelection(event: { projectId: string; taskType: string }) {
    this.loadTasksForProject(event.projectId, event.taskType);
  }

  drop(event: CdkDragDrop<any[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const oldStatus = task.status;
      task.status = newStatus;

      this.tasksService.updateTaskStatus(task._id, newStatus).subscribe(
        () => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        },
        (error) => {
          console.error('Failed to update task status', error);
          task.status = oldStatus;
        }
      );
    }
  }

  dropWithNewStatus(event: CdkDragDrop<string[]>, newStatus: string) {
    this.drop(event, newStatus);
  }

  toggleImportant(task: any): void {
    const updatedStatus = !task.is_important;
    const url = `http://localhost:3000/api/tasks/importance/${task._id}`;
    this.http
      .put(url, { is_important: updatedStatus })
      .subscribe((response: any) => {
        task.is_important = response.is_important; // Update UI state
      });
  }

  trackByFn(index: number, item: any): any {
    return item;
  }

  addTask() {
    const dialogRef = this.dialog.open(AddTaskModalComponent, {
      width: '33%',
      minWidth: '300px',
      maxWidth: '550px',
      panelClass: 'dialog-container',
    });
  }

  importTasks() {
    const dialogRef = this.dialog.open(ImportModalComponent, {
      width: '33%',
      minWidth: '300px',
      maxWidth: '550px',
      panelClass: 'dialog-container',
    });
  }

  exportDisplayedTasks() {
    const data = this.displayedTasks.map((task) => ({
      Title: task.title,
      Description: task.description,
      Status: task.status,
      Important: task.is_important ? 'Yes' : 'No',
      Completed: task.is_completed ? 'Yes' : 'No',
      StoryPoints: task.story_points,
      CreatedAt: task.created_at,
      ProjectId: task.project_id,
      DevId: task.dev_id,
      QaId: task.qa_id,
      CreatedBy: task.created_by,
    }));
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'tasks_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) =>
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        )
        .join(',')
    );
    return [headers, ...rows].join('\r\n');
  }
}
