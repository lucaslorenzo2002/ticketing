import express from 'express';
import {json} from 'body-parser';
import 'express-async-errors';
import { NotFoundError, errorHandler } from '@inmersellsoftware/common';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
);

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signoutRouter)
app.use(signUpRouter)

app.all('*', (req, res, next) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app};