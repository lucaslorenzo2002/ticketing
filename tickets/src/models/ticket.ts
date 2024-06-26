import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ITicketAttrs{
    title: string;
    price: number;
    userId: string;
}

interface ITicketModel extends mongoose.Model<any>{
    build(attrs: ITicketAttrs): ITicketDoc;
}

interface ITicketDoc extends mongoose.Document{
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    orderId:{
        type: String
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
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: ITicketAttrs) => {
    return new Ticket(attrs)
}
const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', ticketSchema);


export{Ticket};