import { DepartmentModel } from './department.model';
import { UserModel } from '../users/user.model';
export declare class DepartmentsService {
    private readonly departmentModel;
    private readonly userModel;
    constructor(departmentModel: typeof DepartmentModel, userModel: typeof UserModel);
    findAll(userRole?: string, userDepartmentId?: number): Promise<DepartmentModel[]>;
    findOne(id: number): Promise<DepartmentModel>;
    create(name: string, description?: string, managerId?: number): Promise<DepartmentModel>;
    update(id: number, dto: {
        name?: string;
        description?: string;
        managerId?: number;
    }): Promise<DepartmentModel>;
    remove(id: number): Promise<void>;
}
