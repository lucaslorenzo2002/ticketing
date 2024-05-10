import { Publisher, OrderCreatedEvent, Subjects } from "@inmersellsoftware/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject = Subjects.OrderCreated
}
