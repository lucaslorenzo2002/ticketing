import express, { NextFunction, Request, Response } from 'express';
import {json} from 'body-parser';
import 'express-async-errors';
import { NotFoundError, errorHandler } from '@inmersellsoftware/common';
import cookieSession from 'cookie-session';
import { newOrdersRouter } from './routes/new';
import { deleteOrdersRouter } from './routes/delete';
import { indexOrdersRouter } from './routes';
import { ShowOrdersRouter } from './routes/show';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
);

app.use(newOrdersRouter);
app.use(deleteOrdersRouter);
app.use(indexOrdersRouter);
app.use(ShowOrdersRouter);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app};