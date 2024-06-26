import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { validateError } from '@inmersellsoftware/common';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min: 8, max:20})
        .withMessage('Password must be between 4 and 20 characters')
],
validateError,
async(req: Request, res: Response) => {
    const {email, password} = req.body;

    const exixtingUser = await User.findOne({email});

    if(exixtingUser){
        console.log('Email in use');
        return res.send({})
    }

    const user = User.build({email, password});
    await user.save();

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, 
    process.env.JWT_KEY!
    );

    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);
});

export {router as signUpRouter};