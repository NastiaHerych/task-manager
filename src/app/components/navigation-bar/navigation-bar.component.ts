import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRole } from 'src/app/shared/enums/user-role.enum';
import { CustomerDataModel } from 'src/app/shared/models/customer-data.model';
import { LoginService } from 'src/app/shared/services/authorization/login.service';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { AddProjectModalComponent } from '../modals/add-project-modal/add-project-modal.component';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  customerData: CustomerDataModel;
  expandedProjectIds: Set<string> = new Set();
  selectedTaskType: string = '';
  selectedProjectId: string = 'all'; // Default to "All Tasks"
  UserRole = UserRole;

  @Input() tasks: any;
  @Output() projectSelected = new EventEmitter<{
    projectId: string;
    taskType: string;
  }>();

  constructor(
    private loginService: LoginService,
    private dialog: MatDialog,
    private projectService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.loginService.customerData$.subscribe((value) => {
      this.customerData = value;
    });
    this.projectSelected.emit({ projectId: 'all', taskType: 'all' });
  }

  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(AddProjectModalComponent, {
      width: '33%',
      minWidth: '300px',
      maxWidth: '550px',
      panelClass: 'dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addProject(result);
      }
    });
  }

  addProject(projectData: { name: string }): void {
    const created_by = this.customerData._id;
    this.projectService.addProject({ ...projectData, created_by }).subscribe();
  }

  toggleTasks(projectId: string) {
    if (this.expandedProjectIds.has(projectId)) {
      this.expandedProjectIds.delete(projectId);
    } else {
      this.expandedProjectIds.add(projectId);
    }
  }

  selectTaskType(projectId: string, taskType: string) {
    this.selectedTaskType = taskType;
    this.projectSelected.emit({ projectId, taskType });
  }

  selectAllTasks() {
    this.selectedProjectId = 'all';
    this.selectedTaskType = 'all';
    this.projectSelected.emit({ projectId: 'all', taskType: 'all' });
  }
}
