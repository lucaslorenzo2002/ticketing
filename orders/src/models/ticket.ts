import mongoose, { mongo } from "mongoose";
import { Order } from "./order";
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';
import { OrderStatus } from "@inmersellsoftware/common";

interface ITicketAttrs{
    id: string;
    title: string;
    price: number;
}

interface ITicketModel extends mongoose.Model<any>{
    build(attrs: ITicketAttrs): ITicketDoc;
    findByEvent(event:{id: string, version: number}): Promise<ITicketDoc | null>;
}

export interface ITicketDoc extends mongoose.Document{
    title: string;
    price: number;
    version: number;
    isReserved: Promise<boolean>;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version-1
    })
}
ticketSchema.statics.build = (attrs: ITicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
}
ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
         ticket: this,
         status: {
             $in: [
                 OrderStatus.Created,
                 OrderStatus.AwaitingPayment,
                 OrderStatus.Complete,
             ]
         }
     })

    return !!existingOrder;
}

const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket2', ticketSchema);

export{Ticket};