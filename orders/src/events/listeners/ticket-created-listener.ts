import { Listener, Subjects, TicketCreatedEvent } from "@inmersellsoftware/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message){
        const {id, title, price} = data;
        const ticket = Ticket.build({
            title,
            price,
            id
        });
        await ticket.save();

        msg.ack();
    }
}