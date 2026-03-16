export declare enum CategoryType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}
export declare class CreateDefaultCategoryDto {
    name: string;
    type: CategoryType;
    icon?: string;
    color?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export declare class UpdateDefaultCategoryDto {
    name?: string;
    type?: CategoryType;
    icon?: string;
    color?: string;
    isActive?: boolean;
    sortOrder?: number;
}
