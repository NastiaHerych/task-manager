import { Component, Input } from '@angular/core';
import { CustomerDataModel } from 'src/app/shared/models/customer-data.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  @Input() customerData: CustomerDataModel;
}
