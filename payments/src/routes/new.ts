import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, currentUser, requireAuth, validateError } from '@inmersellsoftware/common';
import { natsWrapper } from '../nats-wrapper';
import { Order } from '../models/order';

const router = express.Router();
//estoy harcodeando el user id porque no supe como resolver el 401
router.post('/api/payments',
[
    body('token')
        .isString()
        .not()
        .isEmpty()
        .withMessage('Token is required'),
    body('orderId')
        .isString()
        .not()
        .isEmpty()
        .withMessage('orderId is required'),
],
async(req: Request, res: Response) => {
    const {token, orderId} = req.body;

    const order = await Order.findById(orderId);
    if(!order){
        throw new NotFoundError();
    }

    if(order.userId !== "6637a46813d7adaf161ed4a5"){
        throw new NotAuthorizedError();
    }

    if(order.status === OrderStatus.Cancelled){
        throw new BadRequestError('Cannot pay for a cancelled order')
    }

    res.send({success: true})
    
});

export {router as newPaymentRouter};