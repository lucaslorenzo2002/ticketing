import { Publisher, Subjects, TicketUpdatedEvent } from "@inmersellsoftware/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
}