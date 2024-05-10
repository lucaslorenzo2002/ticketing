import { OrderStatus } from "@inmersellsoftware/common";
import mongoose, { mongo } from "mongoose";
import { ITicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface IOrderAttrs{
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: ITicketDoc;
}

interface IOrderModel extends mongoose.Model<any>{
    build(attrs: IOrderAttrs): IOrderDoc;
}

interface IOrderDoc extends mongoose.Document{
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: ITicketDoc;
    version: number;
}

const orderSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt:{
        type: mongoose.Schema.Types.Date
    },
    ticket:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
}, {
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: IOrderAttrs) => {
    return new Order(attrs)
}
const Order = mongoose.model<IOrderDoc, IOrderModel>('Ticket', orderSchema);


export{Order};