import express from 'express'
const router = express.Router()
import multer from 'multer';

import * as fs from 'fs'
import { verifyRefreshTokenMiddleware } from '../auth/utils.js';
import { configDotenv } from "dotenv";
configDotenv();

const imageUploadPath = process.env.PATH_TO_IMAGES;

const PATHES = {
    UA: './translations/whywes/whywesua.json',
    RU: './translations/whywes/whywesru.json',
    PL: './translations/whywes/whywespl.json',
    EN: './translations/whywes/whywesen.json'
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

router.post('/add-whywe', [verifyRefreshTokenMiddleware, imageUpload.any()], (req, res) => {
    try{
    const textDataUa = JSON.parse(req.body.ua)
    const textDataRu = JSON.parse(req.body.ru)
    const textDataEn = JSON.parse(req.body.en)
    const textDataPl = JSON.parse(req.body.pl)
    
    const svg = req.files[0].filename

    const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
    const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
    const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
    const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))

    const idUa = Math.max(...prevDataUa.map((service) => {return +service.id}))
    const idRu = Math.max(...prevDataRu.map((service) => {return +service.id}))
    const idPl = Math.max(...prevDataPl.map((service) => {return +service.id}))
    const idEn = Math.max(...prevDataEn.map((service) => {return +service.id}))

    const isEqual = [idUa, idEn, idPl, idRu].every( (val, i, arr) => val === arr[0] )

    let index = 0;

    console.log(isEqual)

    if(isEqual && prevDataEn.length !== 0){
        index = idUa + 1
    }

        // ua
        fs.writeFileSync(PATHES.UA, JSON.stringify(
            [
                ...prevDataUa,
                {
                    title: textDataUa.title,
                    description: textDataUa.description,
                    svg: svg,
                    id: index
                }
            ]
        ))

        // pl
        fs.writeFileSync(PATHES.PL, JSON.stringify(
            [
                ...prevDataPl,
                {
                    title: textDataPl.title,
                    description: textDataPl.description,
                    svg: svg,
                    id: index
                }
            ]
        ))

        // ru
        fs.writeFileSync(PATHES.RU, JSON.stringify(
            [
                ...prevDataRu,
                {
                    title: textDataRu.title,
                    description: textDataRu.description,
                    svg: svg,
                    id: index
                }
            ]
        ))

        // en
        fs.writeFileSync(PATHES.EN, JSON.stringify(
            [
                ...prevDataEn,
                {
                    title: textDataEn.title,
                    description: textDataEn.description,
                    svg: svg,
                    id: index
                }
            ]
        ))
        return res.status(200).json({error: false, message: 'added'})
    } catch (err){
        return res.status(500).json({error: true, message: err.message})
    }
})

router.get('/get-whywes', (req, res) => {
    fs.readFile(`./translations/whywes/whywes${req.get('language')}.json`, 'utf-8', async (err, fileData) => {
        if(err){
            return res.status(500).json({error: true, message: err.message})
        }
                    res.send(fileData).status(200)
                })
        })

router.post('/edit-whywe', [verifyRefreshTokenMiddleware, imageUpload.any()], (req, res) => {

    try{
    const textDataUa = JSON.parse(req.body.ua)
    const textDataRu = JSON.parse(req.body.ru)
    const textDataEn = JSON.parse(req.body.en)
    const textDataPl = JSON.parse(req.body.pl)

    const id = JSON.parse(req.body.id)

    const idSVG = req.files.findIndex((item) => {
        return item.fieldname == 'iconSVG'
    })

    const svg = idSVG !== -1 ? req.files[idSVG].filename : undefined

    const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
    const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
    const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
    const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))

    const idUa = prevDataUa.findIndex((service) => +service.id == +id)
    const idRu = prevDataRu.findIndex((service) => +service.id == +id)
    const idPl = prevDataPl.findIndex((service) => +service.id == +id)
    const idEn = prevDataEn.findIndex((service) => +service.id == +id)

    if(svg){
        fs.unlinkSync(`${imageUploadPath}/${prevDataUa[idUa].svg}`)
    }


    prevDataUa.splice(idUa, 1, {
        title: textDataUa.title,
        description: textDataUa.description,
        svg: svg ? svg : prevDataUa[idUa].svg,
        id: id
    })


    prevDataEn.splice(idEn, 1, {
        title: textDataEn.title,
        description: textDataEn.description,
        svg: svg ? svg : prevDataUa[idEn].svg,
        id: id
    })


    prevDataRu.splice(idRu, 1, {
        title: textDataRu.title,
        description: textDataRu.description,
        svg: svg ? svg : prevDataUa[idUa].svg,
        id: id
    })

    prevDataPl.splice(idPl, 1, {
        title: textDataPl.title,
        description: textDataPl.description,
        svg: svg ? svg : prevDataUa[idUa].svg,
        id: id
    })

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

router.post('/delete-whywe', (req, res) => {

    try{
    const id = JSON.parse(req.body.id)

    const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
    const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
    const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
    const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))

    const idUa = prevDataUa.findIndex((service) => +service.id == +id)
    const idRu = prevDataRu.findIndex((service) => +service.id == +id)
    const idPl = prevDataPl.findIndex((service) => +service.id == +id)
    const idEn = prevDataEn.findIndex((service) => +service.id == +id)

    fs.unlinkSync(`${imageUploadPath}/${prevDataUa[idUa].svg}`)

        prevDataUa.splice(idUa, 1)
        prevDataEn.splice(idEn, 1)
        prevDataRu.splice(idRu, 1)
        prevDataPl.splice(idPl, 1)

        // ua
        fs.writeFileSync(PATHES.UA, JSON.stringify(prevDataUa))

        // pl
        fs.writeFileSync(PATHES.PL, JSON.stringify(prevDataPl))

        // ru
        fs.writeFileSync(PATHES.RU, JSON.stringify(prevDataRu))

        // en
        fs.writeFileSync(PATHES.EN, JSON.stringify(prevDataEn))
    
        return res.status(200).json({error: false, message: 'deleted'})
    } catch (err){
        return res.status(400).json({error: true, message: err.message})
    }
})

export default router;