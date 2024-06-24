import express from 'express'
const router = express.Router()
import multer from 'multer';

import * as fs from 'fs'

import { verifyRefreshTokenMiddleware } from '../auth/utils.js';
import { configDotenv } from "dotenv";
configDotenv();

const imageUploadPath = process.env.PATH_TO_IMAGES;

const PATHES = {
    UA: './translations/footer/footerua.json',
    RU: './translations/footer/footerru.json',
    PL: './translations/footer/footerpl.json',
    EN: './translations/footer/footeren.json'
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

router.post('/add-social-media', [verifyRefreshTokenMiddleware, imageUpload.any()], (req, res) => {
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

    const idSection = prevDataUa.findIndex((item) => {return item.id === 1})


    const idUa = Math.max(...prevDataUa[idSection].data.map((service) => {return +service.index}))
    const idRu = Math.max(...prevDataRu[idSection].data.map((service) => {return +service.index}))
    const idPl = Math.max(...prevDataPl[idSection].data.map((service) => {return +service.index}))
    const idEn = Math.max(...prevDataEn[idSection].data.map((service) => {return +service.index}))

    const isEqual = [idUa, idEn, idPl, idRu].every( (val, i, arr) => val === arr[0] )

    console.log(isEqual, [idUa, idEn, idPl, idRu])

    let index = 0;

    console.log(isEqual)

    if(isEqual && prevDataEn[idSection].data.length !== 0){
        index = idUa + 1
    }
        // en

        prevDataEn[idSection].data.push({
            text: textDataEn.text,
            src: textDataEn.src,
            svg: svg,
            index: index
        })

        fs.writeFileSync(PATHES.EN, JSON.stringify(prevDataEn))

        // ua

        prevDataUa[idSection].data.push({
            text: textDataUa.text,
            src: textDataUa.src,
            svg: svg,
            index: index
        })

        fs.writeFileSync(PATHES.UA, JSON.stringify(prevDataUa))

        // ru
        
        prevDataRu[idSection].data.push({
            text: textDataRu.text,
            src: textDataRu.src,
            svg: svg,
            index: index
        })

        fs.writeFileSync(PATHES.RU, JSON.stringify(prevDataRu))

        // pl

        prevDataPl[idSection].data.push({
            text: textDataPl.text,
            src: textDataPl.src,
            svg: svg,
            index: index
        })

        fs.writeFileSync(PATHES.PL, JSON.stringify(prevDataPl))
        
        return res.status(200).json({error: false, message: 'added'})
    } catch (err){
        return res.status(500).json({error: true, message: err.message})
    }
})

router.post('/edit-social-media', [verifyRefreshTokenMiddleware, imageUpload.any()], (req, res) => {
    

    try{
        const textDataUa = JSON.parse(req.body.ua)
        const textDataRu = JSON.parse(req.body.ru)
        const textDataEn = JSON.parse(req.body.en)
        const textDataPl = JSON.parse(req.body.pl)

        const idSVG = req.files.findIndex((item) => {
            return item.fieldname == 'svg'
        })

        const svg = idSVG !== -1 ? req.files[idSVG].filename : undefined
    
        const id = req.body.id
    
        const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
        const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
        const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
        const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))
    
        const idSection = prevDataUa.findIndex((item) => {return item.id === 1})
    
        const idUa = prevDataUa[idSection].data.findIndex((item) => {return +item.index == id})
        const idRu = prevDataRu[idSection].data.findIndex((item) => {return +item.index == id})
        const idPl = prevDataPl[idSection].data.findIndex((item) => {return +item.index == id})
        const idEn = prevDataEn[idSection].data.findIndex((item) => {return +item.index == id})

        if(svg){
            fs.unlinkSync(`${imageUploadPath}/${prevDataUa[idSection].data[idUa].svg}`)
        }
            // en
    
            prevDataEn[idSection].data.splice(idEn, 1, {
                text: textDataEn.text,
                src: textDataEn.src,
                svg: svg ? svg : prevDataEn[idSection].data[idEn].svg,
                index: id
            })
    
            fs.writeFileSync(PATHES.EN, JSON.stringify(prevDataEn))
    
            // ua
    
            prevDataUa[idSection].data.splice(idUa, 1, {
                text: textDataUa.text,
                src: textDataUa.src,
                svg: svg ? svg : prevDataUa[idSection].data[idUa].svg,
                index: id
            })
    
            fs.writeFileSync(PATHES.UA, JSON.stringify(prevDataUa))
    
            // ru
            
            prevDataRu[idSection].data.splice(idRu, 1, {
                text: textDataRu.text,
                src: textDataRu.src,
                svg: svg ? svg : prevDataRu[idSection].data[idRu].svg,
                index: id
            })
    
            fs.writeFileSync(PATHES.RU, JSON.stringify(prevDataRu))
    
            // pl
    
            prevDataPl[idSection].data.splice(idPl, 1, {
                text: textDataPl.text,
                src: textDataPl.src,
                svg: svg ? svg : prevDataPl[idSection].data[idPl].svg,
                index: id
            })
    
            fs.writeFileSync(PATHES.PL, JSON.stringify(prevDataPl))
    



        return res.status(200).json({error: false, message: 'edited'})
    } catch (err){
        return res.status(400).json({error: true, message: err.message})
    }
})

//


router.post('/delete-social-media', [verifyRefreshTokenMiddleware, imageUpload.none()],(req, res) => {

    try{    
        const id = req.body.id
    
        const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
        const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
        const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
        const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))
    
        const idSection = prevDataUa.findIndex((item) => {return item.id === 1})
    
        const idUa = prevDataUa[idSection].data.findIndex((item) => {return +item.index == id})
        const idRu = prevDataRu[idSection].data.findIndex((item) => {return +item.index == id})
        const idPl = prevDataPl[idSection].data.findIndex((item) => {return +item.index == id})
        const idEn = prevDataEn[idSection].data.findIndex((item) => {return +item.index == id})
        console.log(idUa)
        console.log(prevDataUa[idSection].data)

            fs.unlinkSync(`${imageUploadPath}/${prevDataUa[idSection].data[idUa].svg}`)
        
            // en
    
            prevDataEn[idSection].data.splice(id, 1)
    
            fs.writeFileSync(PATHES.EN, JSON.stringify(prevDataEn))
    
            // ua
    
            prevDataUa[idSection].data.splice(id, 1)
    
            fs.writeFileSync(PATHES.UA, JSON.stringify(prevDataUa))
    
            // ru
            
            prevDataRu[idSection].data.splice(id, 1)
    
            fs.writeFileSync(PATHES.RU, JSON.stringify(prevDataRu))
    
            // pl
    
            prevDataPl[idSection].data.splice(id, 1)
    
            fs.writeFileSync(PATHES.PL, JSON.stringify(prevDataPl))
    



        return res.status(200).json({error: false, message: 'deleted'})
    } catch (err){
        console.log(err)
        return res.status(400).json({error: true, message: err.message})
    }
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/edit-work-day', [verifyRefreshTokenMiddleware, imageUpload.none()],(req, res) => {
    console.log('edit work day req')
    try{
        const data = req.body
        
        const id = data.id
        
        const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
        const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
        const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
        const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))

        const from = data.time.from.slice(11, 16)
        const to = data.time.to.slice(11, 16)
    
        const idSection = prevDataUa.findIndex((item) => {return item.id === 0})

            // en
    
            prevDataEn[idSection].data[id] = {
                day: prevDataEn[idSection].data[id].day,
                closed: prevDataEn[idSection].data[id].closed,
                isOpen: data.isOpen,
                time: isOpen ? {
                    from: from,
                    to: to
                } : '',

            }
    
            fs.writeFileSync(PATHES.EN, JSON.stringify(prevDataEn))
    
            // ua
    
            prevDataUa[idSection].data.splice(id, 1, {
                day: prevDataEn[idSection].data[id].day,
                closed: prevDataEn[idSection].data[id].closed,
                isOpen: data.isOpen,
                time: isOpen ? {
                    from: from,
                    to: to
                } : '',
            })
    
            fs.writeFileSync(PATHES.UA, JSON.stringify(prevDataUa))
    
            // ru
            
            prevDataRu[idSection].data.splice(id, 1, {
                day: prevDataEn[idSection].data[id].day,
                closed: prevDataEn[idSection].data[id].closed,
                isOpen: data.isOpen,
                time: isOpen ? {
                    from: from,
                    to: to
                } : '',
            })
    
            fs.writeFileSync(PATHES.RU, JSON.stringify(prevDataRu))
    
            // pl
    
            prevDataPl[idSection].data.splice(id, 1, {
                day: prevDataEn[idSection].data[id].day,
                closed: prevDataEn[idSection].data[id].closed,
                isOpen: data.isOpen,
                time: isOpen ? {
                    from: from,
                    to: to
                } : '',
            })
    
            fs.writeFileSync(PATHES.PL, JSON.stringify(prevDataPl))
    



        return res.status(200).json({error: false, message: 'edited'})
    } catch (err){
        return res.status(500).json({error: true, message: err.message})
    }
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/add-site-agreements', [verifyRefreshTokenMiddleware, imageUpload.none()],(req, res) => {
    try{
    const textDataUa = JSON.parse(req.body.ua)
    const textDataRu = JSON.parse(req.body.ru)
    const textDataEn = JSON.parse(req.body.en)
    const textDataPl = JSON.parse(req.body.pl)

    const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
    const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
    const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
    const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))

    const idSection = prevDataUa.findIndex((item) => {return item.id === 2})

    const idUa = Math.max(...prevDataUa[idSection].data.map((service) => {return +service.index}))
    const idRu = Math.max(...prevDataRu[idSection].data.map((service) => {return +service.index}))
    const idPl = Math.max(...prevDataPl[idSection].data.map((service) => {return +service.index}))
    const idEn = Math.max(...prevDataEn[idSection].data.map((service) => {return +service.index}))

    const isEqual = [idUa, idEn, idPl, idRu].every( (val, i, arr) => val === arr[0] )

    let index = 0;

    console.log(isEqual)

    if(isEqual && prevDataEn[idSection].data.length !== 0){
        index = idUa + 1
    }
        // en

        prevDataEn[idSection].data.push({
            text: textDataEn.text,
            src: textDataEn.src,
            index: index
        })

        fs.writeFileSync(PATHES.EN, JSON.stringify(prevDataEn))

        // ua

        prevDataUa[idSection].data.push({
            text: textDataUa.text,
            src: textDataUa.src,
            index: index
        })

        fs.writeFileSync(PATHES.UA, JSON.stringify(prevDataUa))

        // ru
        
        prevDataRu[idSection].data.push({
            text: textDataRu.text,
            src: textDataRu.src,
            index: index
        })

        fs.writeFileSync(PATHES.RU, JSON.stringify(prevDataRu))

        // pl

        prevDataPl[idSection].data.push({
            text: textDataPl.text,
            src: textDataPl.src,
            index: index
        })

        fs.writeFileSync(PATHES.PL, JSON.stringify(prevDataPl))
        
        return res.status(200).json({error: false, message: 'added'})
    } catch (err){
        return res.status(500).json({error: true, message: err.message})
    }
})

router.post('/edit-site-agreements', [verifyRefreshTokenMiddleware, imageUpload.none()],(req, res) => {

    try{
        const textDataUa = JSON.parse(req.body.ua)
        const textDataRu = JSON.parse(req.body.ru)
        const textDataEn = JSON.parse(req.body.en)
        const textDataPl = JSON.parse(req.body.pl)
    
        const id = req.body.id
    
        const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
        const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
        const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
        const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))
    
        const idSection = prevDataUa.findIndex((item) => {return item.id === 2})
    
        const idUa = prevDataUa[idSection].data.findIndex((item) => {return +item.index == id})
        const idRu = prevDataRu[idSection].data.findIndex((item) => {return +item.index == id})
        const idPl = prevDataPl[idSection].data.findIndex((item) => {return +item.index == id})
        const idEn = prevDataEn[idSection].data.findIndex((item) => {return +item.index == id})
            // en
    
            prevDataEn[idSection].data.splice(idEn, 1, {
                text: textDataEn.text,
                src: textDataEn.src,
                index: id
            })
    
            fs.writeFileSync(PATHES.EN, JSON.stringify(prevDataEn))
    
            // ua
    
            prevDataUa[idSection].data.splice(idUa, 1, {
                text: textDataUa.text,
                src: textDataUa.src,
                index: id
            })
    
            fs.writeFileSync(PATHES.UA, JSON.stringify(prevDataUa))
    
            // ru
            
            prevDataRu[idSection].data.splice(idRu, 1, {
                text: textDataRu.text,
                src: textDataRu.src,
                index: id
            })
    
            fs.writeFileSync(PATHES.RU, JSON.stringify(prevDataRu))
    
            // pl
    
            prevDataPl[idSection].data.splice(idPl, 1, {
                text: textDataPl.text,
                src: textDataPl.src,
                index: id
            })
    
            fs.writeFileSync(PATHES.PL, JSON.stringify(prevDataPl))
    



        return res.status(200).json({error: false, message: 'edited'})
    } catch (err){
        return res.status(400).json({error: true, message: err.message})
    }
})

//


router.post('/delete-site-agreement', [verifyRefreshTokenMiddleware, imageUpload.none()],(req, res) => {

    try{    
        const id = req.body.id
    
        const prevDataUa = JSON.parse(fs.readFileSync(PATHES.UA))
        const prevDataRu = JSON.parse(fs.readFileSync(PATHES.RU))
        const prevDataPl = JSON.parse(fs.readFileSync(PATHES.PL))
        const prevDataEn = JSON.parse(fs.readFileSync(PATHES.EN))
    
        const idSection = prevDataUa.findIndex((item) => {return item.id === 2})
    
        const idUa = prevDataUa[idSection].data.findIndex((item) => {return +item.index == id})
        const idRu = prevDataRu[idSection].data.findIndex((item) => {return +item.index == id})
        const idPl = prevDataPl[idSection].data.findIndex((item) => {return +item.index== id})
        const idEn = prevDataEn[idSection].data.findIndex((item) => {return +item.index == id})
        
            // en
    
            prevDataEn[idSection].data.splice(idEn, 1)
    
            fs.writeFileSync(PATHES.EN, JSON.stringify(prevDataEn))
    
            // ua
    
            prevDataUa[idSection].data.splice(idUa, 1)
    
            fs.writeFileSync(PATHES.UA, JSON.stringify(prevDataUa))
    
            // ru
            
            prevDataRu[idSection].data.splice(idRu, 1)
    
            fs.writeFileSync(PATHES.RU, JSON.stringify(prevDataRu))
    
            // pl
    
            prevDataPl[idSection].data.splice(idPl, 1)
    
            fs.writeFileSync(PATHES.PL, JSON.stringify(prevDataPl))
    



        return res.status(200).json({error: false, message: 'deleted'})
    } catch (err){
        return res.status(400).json({error: true, message: err.message})
    }
})


//////////////////////////////////////////////////////////////////////

router.get('/get-footer', (req, res) => {
    fs.readFile(`./translations/footer/footer${req.get('language')}.json`, 'utf-8', async (err, fileData) => {
        if(err){
            return res.status(500).json({error: true, message: err.message})
        }
            res.send(fileData).status(200)
        })
})

export default router;