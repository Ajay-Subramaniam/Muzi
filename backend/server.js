import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { publicRoutes, protectedRoutes, jwtAuth } from './route.js'
import { Server } from 'socket.io'
import { socketHandlers } from './socket.js'

const app = express()
const options = {
  origin: process.env.env == 'development' ? process.env.DEV_CLIENT : process.env.PROD_CLIENT,
  credentials: true
}

app.use(cors(options))
app.use(express.json())
app.use(cookieParser())
app.use(publicRoutes)
app.use(jwtAuth, protectedRoutes)

mongoose.connect(process.env.MONGO_STRING)
  .then(() => console.log('db connected'))
  .catch(() => console.log('db not connected'))


const expressServer = app.listen(process.env.PORT, () => {
  console.log(`running at port ${process.env.PORT}`);
})

export const io = new Server(expressServer, {
  cors: options
});

socketHandlers(io)




