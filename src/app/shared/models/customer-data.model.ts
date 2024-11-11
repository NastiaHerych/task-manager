import { UserRole } from "../enums/user-role.enum";

export class CustomerDataModel {
    username: string;
    role: UserRole;
    email: string;
    password: string;
}