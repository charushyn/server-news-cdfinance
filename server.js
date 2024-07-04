import fs from 'fs'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import multer from 'multer'
import { createHmac } from 'crypto'
import cookieParser from "cookie-parser"
import sharp from 'sharp'
import { Blob } from 'buffer'

// routes
import routeServices from './routes/editor/services.js'
import authRouter from './routes/auth/index.js'
import opinionsRouter from './routes/editor/opinions.js'
import faqsRouter from './routes/editor/faqs.js'
import footerRouter from './routes/editor/footer.js'
import othersRouter from './routes/editor/others.js'
import greetingRouter from './routes/editor/greeting.js'
import whywesRouter from './routes/editor/whywes.js'

import { configDotenv } from "dotenv";
configDotenv();

const app = express()
const PORT = 1488

app.use(cors({
    origin: ['http://localhost:3000', 'https://localhost:3000', 'http://127.0.0.1:3000', 'https://127.0.0.1:3000', 'http://cdfinance.pl', 'https://cdfinance.pl'],
    credentials: true
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser())

app.use('', routeServices)
app.use('', authRouter)
app.use('', greetingRouter)
app.use('', othersRouter)
app.use('', opinionsRouter)
app.use('', faqsRouter)
app.use('', footerRouter)
app.use('', whywesRouter)
app.use('/img', express.static(`${process.env.PATH_TO_IMAGES}`))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});