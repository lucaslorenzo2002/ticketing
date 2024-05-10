import { Listener, OrderCreatedEvent, Subjects } from "@inmersellsoftware/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const {id, ticket, status, userId, version} = data;
        const order = Order.build({
            status,
            price: ticket.price,
            id,
            userId,
            version
        });
        await order.save();

        msg.ack();
    }
}