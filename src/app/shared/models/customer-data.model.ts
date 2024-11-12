import { UserRole } from "../enums/user-role.enum";

export class CustomerDataModel {
    _id: string;
    username: string;
    role: UserRole;
    email: string;
    password: string;
}