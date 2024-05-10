import express, { NextFunction, Request, Response } from 'express';
import {json} from 'body-parser';
import 'express-async-errors';
import { NotFoundError, errorHandler } from '@inmersellsoftware/common';
import cookieSession from 'cookie-session';
import { newTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
);

app.use(newTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app};