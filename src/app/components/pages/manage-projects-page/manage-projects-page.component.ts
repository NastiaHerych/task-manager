import { Component, OnInit } from '@angular/core';
import { CustomerDataModel } from 'src/app/shared/models/customer-data.model';
import { LoginService } from 'src/app/shared/services/authorization/login.service';
import { TasksService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: 'app-manage-projects-page',
  templateUrl: './manage-projects-page.component.html',
  styleUrls: ['./manage-projects-page.component.scss'],
})
export class ManageProjectsPageComponent implements OnInit {
  customerData: CustomerDataModel;
  projects: any;
  tasks: any;

  constructor(
    private loginService: LoginService,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    this.loginService.customerData$.subscribe((value) => {
      this.customerData = value;
    });
    this.tasksService
      .getTasksByProjects(this.customerData._id)
      .subscribe((value) => {
        this.tasks = value.tasks;
      });
  }
}
