import { DepartmentsService } from './departments.service';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    findAll(req: any): Promise<import("./department.model").DepartmentModel[]>;
    findOne(id: string): Promise<import("./department.model").DepartmentModel>;
    create(body: {
        name: string;
        description?: string;
        managerId?: number;
    }): Promise<import("./department.model").DepartmentModel>;
    update(id: string, body: {
        name?: string;
        description?: string;
        managerId?: number;
    }): Promise<import("./department.model").DepartmentModel>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
