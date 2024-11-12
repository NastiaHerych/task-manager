import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent {
  @Input() tasks: any;

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks(this.tasks);
  }

  // Load tasks based on project data
  loadTasks(projectData: any[]) {
    projectData.forEach((project) => {
      project.tasks.forEach((task) => {
        this.tasks[task.status].push(task);
      });
    });
  }
}
