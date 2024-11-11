import { CustomerDataModel } from '../customer-data.model';

export class LoginResponseModel {
  success: boolean;
  token: string;
  userInfo: CustomerDataModel;
}
