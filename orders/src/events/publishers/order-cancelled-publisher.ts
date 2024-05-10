import { Publisher, OrderCancelledEvent, Subjects } from "@inmersellsoftware/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject = Subjects.OrderCancelled
}
