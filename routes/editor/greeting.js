import express from 'express'
const router = express.Router()
import multer from 'multer';

import * as fs from 'fs'

import { verifyRefreshTokenMiddleware } from '../auth/utils.js';
import { configDotenv } from "dotenv";
configDotenv();

const imageUploadPath = process.env.PATH_TO_IMAGES;

const PATHES = {
    UA: './translations/greeting/greetingua.json',
    RU: './translations/greeting/greetingru.json',
    PL: './translations/greeting/greetingpl.json',
    EN: './translations/greeting/greetingen.json'
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, imageUploadPath)
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`)
  }
})

const imageUpload = multer({storage: storage})

router.get('/get-greeting', (req, res) => {
    fs.readFile(`./translations/greeting/greeting${req.get('language')}.json`, 'utf-8', async (err, fileData) => {
        if(err){
            return res.status(500).json({error: true, message: err.message})
        }
                    res.send(fileData).status(200)
                })
        })

router.post('/edit-greeting', [verifyRefreshTokenMiddleware, imageUpload.any()], (req, res) => {

    try{
    const textDataUa = JSON.parse(req.body.ua)
    const textDataRu = JSON.parse(req.body.ru)
    const textDataEn = JSON.parse(req.body.en)
    const textDataPl = JSON.parse(req.body.pl)

    const idImgFirst = req.files.findIndex((item) => {
        return item.fieldname == 'firstImg'
    })

    const idIMGSecond = req.files.findIndex((item) => {
        return item.fieldname == 'secondImg'
    })

    const firstImg = idImgFirst !== -1 ? req.files[idImgFirst].filename : undefined
    const secondImg = idIMGSecond !== -1 ? req.files[idIMGSecond].filename : undefined

    const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
    const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
    const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
    const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))

    if(firstImg){
        fs.unlinkSync(`${imageUploadPath}/${prevDataUa.firstImg}`)
    }

    if(secondImg){
        fs.unlinkSync(`${imageUploadPath}/${prevDataUa.secondImg}`)
    }

    // ua

    prevDataUa.welcome = textDataUa.welcome
    prevDataUa.mission = textDataUa.mission
    prevDataUa.firstImg = firstImg ? firstImg : prevDataUa.firstImg
    prevDataUa.secondImg = secondImg ? secondImg : prevDataUa.secondImg

    // ru

    prevDataRu.welcome = textDataRu.welcome
    prevDataRu.mission = textDataRu.mission
    prevDataRu.firstImg = firstImg ? firstImg : prevDataUa.firstImg
    prevDataRu.secondImg = secondImg ? secondImg : prevDataUa.secondImg

    // en

    prevDataEn.welcome = textDataEn.welcome
    prevDataEn.mission = textDataEn.mission
    prevDataEn.firstImg = firstImg ? firstImg : prevDataUa.firstImg
    prevDataEn.secondImg = secondImg ? secondImg : prevDataUa.secondImg

    // pl
    prevDataPl.welcome = textDataPl.welcome
    prevDataPl.mission = textDataPl.mission
    prevDataPl.firstImg = firstImg ? firstImg : prevDataUa.firstImg
    prevDataPl.secondImg = secondImg ? secondImg : prevDataUa.secondImg

        // ua
        fs.writeFileSync(PATHES.UA, JSON.stringify(prevDataUa))

        // pl
        fs.writeFileSync(PATHES.PL, JSON.stringify(prevDataPl))

        // ru
        fs.writeFileSync(PATHES.RU, JSON.stringify(prevDataRu))

        // en
        fs.writeFileSync(PATHES.EN, JSON.stringify(prevDataEn))
    



        return res.status(200).json({error: false, message: 'edited'})
    } catch (err){ 
        return res.status(400).json({error: true, message: err.message})
    }
})

export default router;
