import express, { NextFunction, Request, Response } from 'express';
import {json} from 'body-parser';
import 'express-async-errors';
import { NotFoundError, errorHandler } from '@inmersellsoftware/common';
import cookieSession from 'cookie-session';
import { newPaymentRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
);

app.use(newPaymentRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app};