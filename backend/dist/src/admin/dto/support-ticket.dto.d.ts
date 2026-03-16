import { TicketPriority, TicketStatus } from '@prisma/client';
export { TicketPriority, TicketStatus };
export declare class CreateTicketDto {
    subject: string;
    description: string;
    priority?: TicketPriority;
}
export declare class UpdateTicketDto {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedToId?: string;
}
export declare class CreateTicketReplyDto {
    message: string;
}
