import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { currentUser, requireAuth, validateError } from '@inmersellsoftware/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
//estoy harcodeando el user id porque no supe como resolver el 401
router.post('/api/tickets',
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
async(req: Request, res: Response) => {
    const{title, price} = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: "6637a46813d7adaf161ed4a5"
    });

    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: "6637a46813d7adaf161ed4a5",
        version: ticket.version
    })
    //publish event
    res.status(201).send(ticket);
});

export {router as newTicketRouter};