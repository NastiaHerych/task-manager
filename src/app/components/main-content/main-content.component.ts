import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { LoginService } from 'src/app/shared/services/authorization/login.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { CustomerDataModel } from 'src/app/shared/models/customer-data.model';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent {
  tasks: any;
  customerData: CustomerDataModel;
  displayedTasks: any[] = []; // Array to store filtered tasks

  constructor(
    private loginService: LoginService,
    private tasksService: TasksService
  ) {}

  statuses = [
    'new',
    'in_progress',
    'in_review',
    'blocked',
    'done',
    'ready_for_qa',
    'in_qa',
    'qa_passed',
    'preprod_passed',
    'deployed',
  ];

  // Max 5 statuses to display
  selectedStatuses = ['new', 'in_progress', 'in_review', 'blocked', 'done'];

  tasksList: { [key: string]: any[] } = {
    new: [],
    in_progress: [],
    in_review: [],
    blocked: [],
    done: [],
  };

  ngOnInit() {
    this.loginService.customerData$.subscribe((value) => {
      this.customerData = value;
      this.tasksService
        .getTasksByProjects(this.customerData._id)
        .subscribe((value) => {
          this.tasks = value.tasks;
          console.log('00', this.tasks);
          // this.loadTasks(this.tasks);
          this.loadTasksForProject(this.tasks[0].project_id, 'all');
        });
    });
  }

  // Load tasks based on project and task type
  loadTasksForProject(projectId: string, taskType: string) {
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
        default: // 'all'
          return true;
      }
    });

    // Clear tasksList and categorize filtered tasks by status
    this.resetTaskList();
    tasks.forEach((task) => {
      const status = task.status as keyof typeof this.tasksList;
      if (this.tasksList[status]) {
        this.tasksList[status].push(task);
      }
    });
  }

  // Reset task list to start fresh for each selection
  private resetTaskList() {
    Object.keys(this.tasksList).forEach((key) => {
      this.tasksList[key as keyof typeof this.tasksList] = [];
    });
  }

  // Handle project selection from the navigation bar
  onProjectSelection(event: { projectId: string; taskType: string }) {
    this.loadTasksForProject(event.projectId, event.taskType);
  }

  // Load tasks based on project data
  loadTasks(projectData: any[]) {
    projectData.forEach((project) => {
      project.tasks.forEach((task) => {
        this.tasksList[task.status].push(task);
      });
    });
    console.log(this.tasksList);
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

      // Call backend to update status
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
          task.status = oldStatus; // Revert status if update fails
        }
      );
    }
  }

  // Function for dynamically passing new status
  dropWithNewStatus(event: CdkDragDrop<string[]>, newStatus: string) {
    this.drop(event, newStatus);
  }

  trackByFn(index: number, item: any): any {
    return item;
  }
}
