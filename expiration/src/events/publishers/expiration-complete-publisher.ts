import { ExpirationCompletedEvent, Publisher, Subjects } from "@inmersellsoftware/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompletedEvent>{
    readonly subject = Subjects.ExpirationCompleted;
}