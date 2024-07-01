import express from 'express'
const router = express.Router()
import multer from 'multer';

import * as fs from 'fs'
import { verifyRefreshTokenMiddleware } from '../auth/utils.js';

const imageUploadPath = '/Users/charushyn/Documents/GitHub/server-cdfinance/files';

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
        

router.post('/edit-other', imageUpload.any(), (req, res) => {

    try{
    const textDataUa = JSON.parse(req.body.ua)
    const textDataRu = JSON.parse(req.body.ru)
    const textDataEn = JSON.parse(req.body.en)
    const textDataPl = JSON.parse(req.body.pl)

    const idLogo = req.files.findIndex((item) => {
        return item.fieldname == 'logo'
    })

    const logo = idLogo !== -1 ? req.files[idLogo].path : undefined

    const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
    const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
    const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
    const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))

    if(logo){
        fs.unlinkSync(prevDataUa.logo)
    }
    // ua

    prevDataUa.h1 = textDataUa.h1 ? textDataUa.h1 : prevDataUa.h1
    prevDataUa.buttons = textDataUa.buttons ? textDataUa.buttons : prevDataUa.buttons
    prevDataUa.map = textDataUa.map ? textDataUa.map : prevDataUa.map
    prevDataUa.logo = logo ? logo : prevDataUa.logo

    // ru

    prevDataRu.h1 = textDataRu.h1 ? textDataRu.h1 : prevDataRu.h1
    prevDataRu.buttons = textDataRu.buttons ? textDataRu.buttons : prevDataRu.buttons
    prevDataRu.map = textDataRu.map ? textDataRu.map : prevDataRu.map
    prevDataRu.logo = logo ? logo : prevDataUa.logo

    // en

    prevDataEn.h1 = textDataEn.h1 ? textDataEn.h1 : prevDataEn.h1
    prevDataEn.buttons = textDataEn.buttons ? textDataEn.buttons : prevDataEn.buttons
    prevDataEn.map = textDataEn.map ? textDataEn.map : prevDataEn.map
    prevDataEn.logo = logo ? logo : prevDataUa.logo

    // pl

    prevDataPl.h1 = textDataPl.h1 ? textDataPl.h1 : prevDataPl.h1
    prevDataPl.buttons = textDataPl.buttons ? textDataPl.buttons : prevDataPl.buttons
    prevDataPl.map = textDataPl.map ? textDataPl.map : prevDataPl.map
    prevDataPl.logo = logo ? logo : prevDataUa.logo

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