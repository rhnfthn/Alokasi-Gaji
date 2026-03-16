import { ReportStatus, ReportType } from '@prisma/client';
export { ReportStatus, ReportType };
export declare class CreateAdminReportDto {
    title: string;
    description?: string;
    type: ReportType;
    dateFrom?: string;
    dateTo?: string;
}
export declare class ListAdminReportsQueryDto {
    page?: number;
    limit?: number;
    status?: ReportStatus;
    type?: ReportType;
}
