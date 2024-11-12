import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerDataModel } from 'src/app/shared/models/customer-data.model';
import { LoginService } from 'src/app/shared/services/authorization/login.service';
import { TasksService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  customerData: CustomerDataModel;
  tasks: any;

  constructor(
    private loginService: LoginService,
    private tasksService: TasksService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginService.customerData$.subscribe((value) => {
      this.customerData = value;
      this.tasksService
        .getTasksByProjects(this.customerData._id)
        .subscribe((value) => {
          this.tasks = value.tasks;
          console.log(this.tasks);
        });
    });
  }
}
