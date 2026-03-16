export declare enum TicketPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare class CreateTicketDto {
    subject: string;
    message: string;
    priority?: TicketPriority;
}
export declare class CreateReplyDto {
    message: string;
}
