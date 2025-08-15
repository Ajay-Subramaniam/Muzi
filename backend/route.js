import express from 'express'
import zod from 'zod'
import jwt from 'jsonwebtoken'
import { userModel } from './mongooseModel.js'
import { OAuth2Client } from 'google-auth-library';

export const publicRoutes = express.Router()
export const protectedRoutes = express.Router()

const signin = zod.object({
    email: zod.email(),
    password: zod.string().min(5)
})

const signInDetailsCheck = (req, res, next) => {
    const result = signin.safeParse(req.body)
    if (result.success) {
        next()
    }
    else {
        res.status(401).send('invalid credentials')
    }
}

publicRoutes.post('/signin', signInDetailsCheck, async (req, res) => {
    try {
        let record = await userModel.findOne({ ...req.body }).select({ name: 1, _id: 1, role: 1 })
        if (record == null) {
            res.status(401).send('no records found')
            return
        }
        else {
            record = record.toObject();
            record._id = record._id.toString()
            const token = jwt.sign(record, process.env.JWT_SECRET);
            res.cookie('token', token, { httpOnly: true })
            res.send(record)
        }
    }
    catch (err) {
        console.log("sign in error", err)
        res.status(500).send('Internal Server Error')
    }
})


const signup = zod.object({
    name: zod.string(),
    email: zod.email(),
    password: zod.string().min(5)
})

const signUpDetailsCheck = (req, res, next) => {
    const result = signup.safeParse(req.body)
    if (result.success) {
        next()
    }
    else {
        res.status(401).send('invalid credentials')
    }
}


publicRoutes.post('/signup', async (req, res) => {
    try {
        let record = await userModel.findOne({ email: req.body.email })
        if (record) {
            res.status(401).send({ message: 'email already exists' })
            return
        }
        else {
            let user = new userModel({ ...req.body })
            let t = await user.save()
            res.send('user created successfully!!')
        }
    }
    catch (err) {
        console.log('sign up error', err)
        res.status(500).send('Internal server error')
    }
})


publicRoutes.get('/health', (req, res) => {
    res.status(200).send('healthy');
})

publicRoutes.post('/google/auth', async (req, res) => {
    try {
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.WEB_CLIENT_ID,
        })
        const payload = ticket.getPayload();
        const name = payload.name
        const email = payload.email
        let record = await userModel.findOne({ email }, { name: 1, _id: 1, role: 1 })
        if (record == null) {//proceed with sign up logic
            console.log('inside google sso creation of new user')
            record = new userModel({ name, email })
            await record.save()
        }
        record = record.toObject();
        record._id = record._id.toString()
        const token = jwt.sign(record, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true })
        res.send('success')
    }
    catch (err) {
        console.log('Error in sso google', err)
        res.status(401).send('something wrong!!')
    }
})

protectedRoutes.get('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true });
    res.send({ message: 'Logged out successfully' });
});

protectedRoutes.get('/auth', (req, res) => {
    res.send(req.userData)
})

export function jwtAuth(req, res, next) {
    if (req.cookies["token"] == undefined) {
        res.status(401).send("unauthorized no token found")
        return
    }
    const token = req.cookies.token
    try {
        const decodeData = jwt.verify(token, process.env.JWT_SECRET)
        const data = {
            id: decodeData._id,
            name: decodeData.name,
            role: decodeData.role,
        }
        req.userData = data
        next()
    }
    catch (err) {
        console.log("error parsing token", err)
        res.status(401).send("unauthorized")
    }
}
