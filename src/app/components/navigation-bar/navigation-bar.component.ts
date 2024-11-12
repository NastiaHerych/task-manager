import { Component, Input, OnInit } from '@angular/core';
import { CustomerDataModel } from 'src/app/shared/models/customer-data.model';
import { LoginService } from 'src/app/shared/services/authorization/login.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  customerData: CustomerDataModel;
  expandedProjectIds: Set<string> = new Set();

  @Input() tasks: any;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.customerData$.subscribe((value) => {
      this.customerData = value;
      console.log(this.customerData);
    });
  }

  toggleTasks(projectId: string) {
    if (this.expandedProjectIds.has(projectId)) {
      this.expandedProjectIds.delete(projectId); // Collapse if already expanded
    } else {
      this.expandedProjectIds.add(projectId); // Expand if collapsed
    }
  }
}
