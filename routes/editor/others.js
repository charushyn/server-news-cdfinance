import express from 'express'
const router = express.Router()
import multer from 'multer';

import * as fs from 'fs'
import { verifyRefreshTokenMiddleware } from '../auth/utils.js';

import { configDotenv } from "dotenv";
configDotenv();

const imageUploadPath = process.env.PATH_TO_IMAGES;

const PATHES = {
    UA: './translations/other/otherua.json',
    RU: './translations/other/otherru.json',
    PL: './translations/other/otherpl.json',
    EN: './translations/other/otheren.json'
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

router.get('/get-other', (req, res) => {
    fs.readFile(`./translations/other/other${req.get('language')}.json`, 'utf-8', async (err, fileData) => {
        if(err){
            return res.status(500).json({error: true, message: err.message})
        }

                    res.send(fileData).status(200)
                })
})

router.get('/edit-img', [verifyRefreshTokenMiddleware, imageUpload.single()],(req, res) => {
    console.log('here')
        try{
        const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
        const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
        const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
        const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))
        
        // switch(req.body.file)

        // fs.unlinkSync(`${imageUploadPath}/${req.body.path}`)


        } catch(e){
            res.send(500)
        }


        res.send(fileData).status(200)
})

router.post('/edit-map', imageUpload.none(), (req,res) => {
    try{
        const body = req.body

        const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
        const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
        const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
        const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))


        // ua

        prevDataUa.map = {
            adress: body.adress,
            link: body.link,
            coordination: [+body.X, +body.Y],
        }
        // ru

        prevDataRu.map = {
            adress: body.adress,
            link: body.link,
            coordination: [+body.X, +body.Y],
        }
        // en

        prevDataEn.map = {
            adress: body.adress,
            link: body.link,
            coordination: [+body.X, +body.Y],
        }
        // pl

        prevDataPl.map = {
            adress: body.adress,
            link: body.link,
            coordination: [+body.X, +body.Y],
        }

        fs.writeFileSync(PATHES.UA, JSON.stringify(prevDataUa))
        fs.writeFileSync(PATHES.PL, JSON.stringify(prevDataPl))
        fs.writeFileSync(PATHES.RU, JSON.stringify(prevDataRu))
        fs.writeFileSync(PATHES.EN, JSON.stringify(prevDataEn))


        return res.status(200).json({error: false, message: 'edited'})
    } catch (err){
        return res.status(500).json({error: true, message: err.message})
    }
})

router.post('/edit-logo', imageUpload.single(), (req,res) => {
    try{
        const logo = req.files[0].path

        const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
        const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
        const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
        const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))


        fs.unlinkSync(prevDataUa.logo)

        prevDataUa.logo = logo
        prevDataRu.logo = logo
        prevDataEn.logo = logo
        prevDataPl.logo = logo

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

router.post('/edit-feedback-bg', imageUpload.single(), (req,res) => {
    try{
        const feedback_bg = req.files[0].path

        const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
        const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
        const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
        const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))


        fs.unlinkSync(prevDataUa.feedbackbg)

        prevDataUa.feedbackbg = feedback_bg
        prevDataRu.feedbackbg = feedback_bg
        prevDataEn.feedbackbg = feedback_bg
        prevDataPl.feedbackbg = feedback_bg

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