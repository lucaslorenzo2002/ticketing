import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateError } from '@inmersellsoftware/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
//user id harcodeado
router.put('/api/tickets/:id', 
[
    body('title')
        .isString()
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({gt: 0})
        .withMessage('Price must be greater than 0')
], 
validateError,

async(req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        throw new NotFoundError();
    }

    if(ticket.userId !==  "6637a46813d7adaf161ed4a5"){
        throw new NotAuthorizedError();
    }

    if(ticket.orderId){
        throw new BadRequestError('Ticket is reserverd');
    }

    const{title, price} = req.body;

    ticket.set({
        title,
        price
    });

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: "6637a46813d7adaf161ed4a5",
        version: ticket.version
    })

    res.status(201).send(ticket);
});

export {router as updateTicketRouter};
