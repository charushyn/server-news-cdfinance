import express from 'express'
const router = express.Router()
import multer from 'multer';

import * as fs from 'fs'

import { verifyRefreshTokenMiddleware } from '../auth/utils.js';
import { configDotenv } from "dotenv";
configDotenv();

const imageUploadPath = process.env.PATH_TO_IMAGES;

const PATHES = {
    UA: './translations/opinions/opinionsua.json',
    RU: './translations/opinions/opinionsru.json',
    PL: './translations/opinions/opinionspl.json',
    EN: './translations/opinions/opinionsen.json'
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

router.post('/add-opinion', [verifyRefreshTokenMiddleware, imageUpload.any()], (req, res) => {
    try{
    const textDataUa = JSON.parse(req.body.ua)
    const textDataRu = JSON.parse(req.body.ru)
    const textDataEn = JSON.parse(req.body.en)
    const textDataPl = JSON.parse(req.body.pl)
    
    const img = req.files[0].filename

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
                    description: textDataUa.description,
                    name: textDataUa.name,
                    position: textDataUa.position,
                    img: img,
                    id: index
                }
            ]
        ))

        // pl
        fs.writeFileSync(PATHES.PL, JSON.stringify(
            [
                ...prevDataPl,
                {
                    description: textDataPl.description,
                    name: textDataPl.name,
                    position: textDataPl.position,
                    img: img,
                    id: index
                }
            ]
        ))

        // ru
        fs.writeFileSync(PATHES.RU, JSON.stringify(
            [
                ...prevDataRu,
                {
                    description: textDataRu.description,
                    name: textDataRu.name,
                    position: textDataRu.position,
                    img: img,
                    id: index
                }
            ]
        ))

        // en
        fs.writeFileSync(PATHES.EN, JSON.stringify(
            [
                ...prevDataEn,
                {
                    description: textDataEn.description,
                    name: textDataEn.name,
                    position: textDataEn.position,
                    img: img,
                    id: index
                }
            ]
        ))
        return res.status(200).json({error: false, message: 'added'})
    } catch (err){
        return res.status(500).json({error: true, message: err.message})
    }
})

router.get('/get-opinions', (req, res) => {
    console.log('gotres opinions')
    fs.readFile(`./translations/opinions/opinions${req.get('language')}.json`, 'utf-8', (err, fileData) => {
        if(err){
            return res.status(500).json({error: true, message: err.message})
        }
                    res.send(fileData).status(200)
                })
        })

router.post('/edit-opinion', [verifyRefreshTokenMiddleware, imageUpload.any()], (req, res) => {

    try{
    const textDataUa = JSON.parse(req.body.ua)
    const textDataRu = JSON.parse(req.body.ru)
    const textDataEn = JSON.parse(req.body.en)
    const textDataPl = JSON.parse(req.body.pl)

    const id = JSON.parse(req.body.id)

    const idIMG = req.files.findIndex((item) => {
        return item.fieldname == 'img'
    })

    const img = idIMG !== -1 ? req.files[idIMG].filename : undefined

    const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
    const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
    const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
    const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))

    const idUa = prevDataUa.findIndex((service) => +service.id == +id)
    const idRu = prevDataRu.findIndex((service) => +service.id == +id)
    const idPl = prevDataPl.findIndex((service) => +service.id == +id)
    const idEn = prevDataEn.findIndex((service) => +service.id == +id)

    if(img){
        fs.unlinkSync(`${imageUploadPath}/${prevDataUa[idUa].img}`)
    }


    prevDataUa.splice(idUa, 1, {
        description: textDataUa.description,
        name: textDataUa.name,
        position: textDataUa.position,
        img: img ? img : prevDataUa[idUa].img,
        id: id
    })


    prevDataEn.splice(idEn, 1, {
        description: textDataEn.description,
        name: textDataEn.name,
        position: textDataEn.position,
        img: img ? img : prevDataUa[idUa].img,
        id: id
    })


    prevDataRu.splice(idRu, 1, {
        description: textDataRu.description,
        name: textDataRu.name,
        position: textDataRu.position,
        img: img ? img : prevDataUa[idUa].img,
        id: id
    })

    prevDataPl.splice(idPl, 1, {
        description: textDataPl.description,
        name: textDataPl.name,
        position: textDataPl.position,
        img: img ? img : prevDataUa[idUa].img,
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

router.post('/delete-opinion', [verifyRefreshTokenMiddleware, imageUpload.none()],(req, res) => {

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

        fs.unlinkSync(`${imageUploadPath}/${prevDataUa[idUa].img}`)

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