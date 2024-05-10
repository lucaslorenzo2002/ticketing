import { Publisher, Subjects, TicketCreatedEvent } from "@inmersellsoftware/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}