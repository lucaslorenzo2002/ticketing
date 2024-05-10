import { Listener, ExpirationCompletedEvent, Subjects, OrderStatus } from "@inmersellsoftware/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompletedEvent>{
    readonly subject = Subjects.ExpirationCompleted;
    queueGroupName = queueGroupName;
    async onMessage(data: ExpirationCompletedEvent['data'], msg: Message){
        //corroborar si la orden esta paga
        const order = await Order.findById(data.orderId).populate('ticket');
        if(!order){
            throw new Error('order not found');
        }
        
        order.set({
            status: OrderStatus.Cancelled
        });

        
        console.log(order)
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })
        
        msg.ack();
    }
}