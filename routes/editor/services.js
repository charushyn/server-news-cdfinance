import express from 'express'
const router = express.Router()
import multer from 'multer';

import * as fs from 'fs'
import { verifyRefreshTokenMiddleware } from '../auth/utils.js';
import { configDotenv } from "dotenv";
configDotenv();

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

router.post('/add-service', [verifyRefreshTokenMiddleware, imageUpload.any()], (req, res) => {
    try{
    const textDataUa = JSON.parse(req.body.ua)
    const textDataRu = JSON.parse(req.body.ru)
    const textDataEn = JSON.parse(req.body.en)
    const textDataPl = JSON.parse(req.body.pl)
    
    const bg = req.files[1].filename
    const svg = req.files[0].filename


    const prevDataUa = JSON.parse(fs.readFileSync('./translations/services/servicesua.json'))
    const prevDataRu = JSON.parse(fs.readFileSync('./translations/services/servicesru.json'))
    const prevDataPl = JSON.parse(fs.readFileSync('./translations/services/servicespl.json'))
    const prevDataEn = JSON.parse(fs.readFileSync('./translations/services/servicesen.json'))

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
        fs.writeFileSync('./translations/services/servicesua.json', JSON.stringify(
            [
                ...prevDataUa,
                {
                    title: textDataUa.title,
                    description: textDataUa.description,
                    bg: bg,
                    svg: svg,
                    id: index
                }
            ]
        ))

        // pl
        fs.writeFileSync('./translations/services/servicespl.json', JSON.stringify(
            [
                ...prevDataPl,
                {
                    title: textDataPl.title,
                    description: textDataPl.description,
                    bg: bg,
                    svg: svg,
                    id: index
                }
            ]
        ))

        // ru
        fs.writeFileSync('./translations/services/servicesru.json', JSON.stringify(
            [
                ...prevDataRu,
                {
                    title: textDataRu.title,
                    description: textDataRu.description,
                    bg: bg,
                    svg: svg,
                    id: index
                }
            ]
        ))

        // en
        fs.writeFileSync('./translations/services/servicesen.json', JSON.stringify(
            [
                ...prevDataEn,
                {
                    title: textDataEn.title,
                    description: textDataEn.description,
                    bg: bg,
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

router.get('/get-services', (req, res) => {
    fs.readFile(`./translations/services/services${req.get('language')}.json`, 'utf-8', async (err, fileData) => {
        if(err){
            return res.status(500).json({error: true, message: err.message})
        }                   
                    res.send(fileData).status(200)
                })
        })



router.post('/edit-service', [verifyRefreshTokenMiddleware, imageUpload.any()], (req, res) => {

    try{
    const textDataUa = JSON.parse(req.body.ua)
    const textDataRu = JSON.parse(req.body.ru)
    const textDataEn = JSON.parse(req.body.en)
    const textDataPl = JSON.parse(req.body.pl)

    const id = JSON.parse(req.body.id)


    const idBG = req.files.findIndex((item) => {
        return item.fieldname == 'bgPhoto'
    })

    const idSVG = req.files.findIndex((item) => {
        return item.fieldname == 'iconSVG'
    })
    const bg = idBG !== -1 ? req.files[idBG].filename : undefined
    const svg = idSVG !== -1 ? req.files[idSVG].filename : undefined


    const prevDataUa = JSON.parse(fs.readFileSync('./translations/services/servicesua.json'))
    const prevDataRu = JSON.parse(fs.readFileSync('./translations/services/servicesru.json'))
    const prevDataPl = JSON.parse(fs.readFileSync('./translations/services/servicespl.json'))
    const prevDataEn = JSON.parse(fs.readFileSync('./translations/services/servicesen.json'))


    const idUa = prevDataUa.findIndex((service) => +service.id == +id)
    const idRu = prevDataRu.findIndex((service) => +service.id == +id)
    const idPl = prevDataPl.findIndex((service) => +service.id == +id)
    const idEn = prevDataEn.findIndex((service) => +service.id == +id)

    if(bg){
        fs.unlinkSync(`${imageUploadPath}/${prevDataUa[idUa].bg}`)
    }
    if(svg){
        fs.unlinkSync(`${imageUploadPath}/${prevDataUa[idUa].svg}`)
    }


    prevDataUa.splice(idUa, 1, {
        title: textDataUa.title,
        description: textDataUa.description,
        bg: bg ? bg : prevDataUa[idUa].bg,
        svg: svg ? svg : prevDataUa[idUa].svg,
        id: id
    })

    console.log('here 0.5')

    prevDataEn.splice(idEn, 1, {
        title: textDataEn.title,
        description: textDataEn.description,
        bg: bg ? bg : prevDataUa[idEn].bg,
        svg: svg ? svg : prevDataUa[idEn].svg,
        id: id
    })

    console.log('here 0.2')

    prevDataRu.splice(idRu, 1, {
        title: textDataRu.title,
        description: textDataRu.description,
        bg: bg ? bg : prevDataUa[idUa].bg,
        svg: svg ? svg : prevDataUa[idUa].svg,
        id: id
    })

    prevDataPl.splice(idPl, 1, {
        title: textDataPl.title,
        description: textDataPl.description,
        bg: bg ? bg : prevDataUa[idUa].bg,
        svg: svg ? svg : prevDataUa[idUa].svg,
        id: id
    })

    console.log('here -1')

        // ua
        fs.writeFileSync('./translations/services/servicesua.json', JSON.stringify(prevDataUa))

        // pl
        fs.writeFileSync('./translations/services/servicespl.json', JSON.stringify(prevDataPl))

        // ru
        fs.writeFileSync('./translations/services/servicesru.json', JSON.stringify(prevDataRu))

        // en
        fs.writeFileSync('./translations/services/servicesen.json', JSON.stringify(prevDataEn))
    



        return res.status(200).json({error: false, message: 'edited'})
    } catch (err){
        return res.status(400).json({error: true, message: err.message})
    }
})

router.post('/delete-service', verifyRefreshTokenMiddleware, (req, res) => {

    try{
    const id = JSON.parse(req.body.id)

    const prevDataUa = JSON.parse(fs.readFileSync('./translations/services/servicesua.json'))
    const prevDataRu = JSON.parse(fs.readFileSync('./translations/services/servicesru.json'))
    const prevDataPl = JSON.parse(fs.readFileSync('./translations/services/servicespl.json'))
    const prevDataEn = JSON.parse(fs.readFileSync('./translations/services/servicesen.json'))

    const idUa = prevDataUa.findIndex((service) => +service.id == +id)
    const idRu = prevDataRu.findIndex((service) => +service.id == +id)
    const idPl = prevDataPl.findIndex((service) => +service.id == +id)
    const idEn = prevDataEn.findIndex((service) => +service.id == +id)


    fs.unlinkSync(`${imageUploadPath}/${prevDataUa[idUa].bg}`)
    fs.unlinkSync(`${imageUploadPath}/${prevDataUa[idUa].svg}`)
    

    console.log(idUa, idRu, idEn, idPl)

        prevDataUa.splice(idUa, 1)
        prevDataEn.splice(idEn, 1)
        prevDataRu.splice(idRu, 1)
        prevDataPl.splice(idPl, 1)

        // ua
        fs.writeFileSync('./translations/services/servicesua.json', JSON.stringify(prevDataUa))

        // pl
        fs.writeFileSync('./translations/services/servicespl.json', JSON.stringify(prevDataPl))

        // ru
        fs.writeFileSync('./translations/services/servicesru.json', JSON.stringify(prevDataRu))

        // en
        fs.writeFileSync('./translations/services/servicesen.json', JSON.stringify(prevDataEn))
    



        return res.status(200).json({error: false, message: 'deleted'})
    } catch (err){
        return res.status(400).json({error: true, message: err.message})
    }
})



export default router;