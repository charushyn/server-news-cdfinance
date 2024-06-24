import fs from 'fs'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import multer from 'multer'
import { createHmac } from 'crypto'
import cookieParser from "cookie-parser"

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

const imageUploadPath = process.env.PATH_TO_IMAGES;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, imageUploadPath)
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`)
  }
})

const imageUpload = multer({storage: storage})

app.use(cors({
    origin: 'http://localhost:3000',
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


app.post('/img', imageUpload.none(), (req, res) => {
    try{
        const filename = req.body.name
        const data = fs.readFileSync(`${imageUploadPath}/${filename}`)
        console.log(data)
        return res.send(JSON.stringify(data)).status(200)
        
    } catch(e) {
        return res.send(JSON.stringify(e)).status(500)
    }
    
})



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});