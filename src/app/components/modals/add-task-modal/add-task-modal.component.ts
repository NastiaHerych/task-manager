import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRole } from 'src/app/shared/enums/user-role.enum';
import { CustomerDataModel } from 'src/app/shared/models/customer-data.model';
import { LoginService } from 'src/app/shared/services/authorization/login.service';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
})
export class AddTaskModalComponent {
  taskForm: FormGroup;
  projects: any[] = [];
  developers: any[] = [];
  qaUsers: any[] = [];
  customerData: CustomerDataModel;

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private userService: UserService,
    private projectsService: ProjectsService,
    private loginService: LoginService,
    public dialogRef: MatDialogRef<AddTaskModalComponent>
  ) {
    this.loginService.customerData$.subscribe((value) => {
      this.customerData = value;
      this.taskForm = this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        story_points: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        project_id: ['', Validators.required],
        dev_id: ['', Validators.required],
        qa_id: ['', Validators.required],
        is_important: [false],
        status: 'new',
        is_completed: false,
        created_by: this.customerData._id,
      });
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.projectsService.getProjects().subscribe((response: any) => {
      this.projects = response.projects;
    });

    this.userService
      .getUsersByRole(UserRole.Developer)
      .subscribe((response: any) => {
        this.developers = response.users;
      });

    this.userService.getUsersByRole(UserRole.QA).subscribe((response: any) => {
      this.qaUsers = response.users;
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onAdd() {
    if (this.taskForm.valid) {
      this.tasksService.createTask(this.taskForm.value).subscribe(
        (response) => {
          this.dialogRef.close(response);
          window.location.reload();
        },
        (error) => {
          console.error('Error adding task:', error);
        }
      );
    }
  }
}
