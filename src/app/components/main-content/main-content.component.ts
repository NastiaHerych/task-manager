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
          this.loadTasksForProject(this.tasks[0].project_id, 'all');
        });
    });
  }

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

  trackByFn(index: number, item: any): any {
    return item;
  }
}
