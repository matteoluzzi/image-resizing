const sharp = require('sharp')
const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000

const version = '0.0.1';



app.get("/version", (req,res) => res.send(version));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get("/resize", (req,res) => {

    const width = parseInt(req.query['w'])
    const height = parseInt(req.query['h'])
    const resizeMode = req.query['rm'] || 'cover';
    const resizeGravity = req.query['rg'] || 'centre';
    const format = req.query.format

    res.type(`image/${format || 'png'}`)

    resize(width, height, resizeMode, resizeGravity, format).pipe(res);

    
});

function resize(width, height, resizeMode, resizeGravity, format) {

    const readStream = fs.createReadStream('./images/panorama.jpg')

    let resizeObj = sharp()

    if(format) {
        resizeObj.toFormat(format)
    }

    if(width || height) {
        resizeObj
        .resize(width, height, {
            fit: resizeMode,
            gravity: resizeGravity
        } )
    }
    
    return readStream.pipe(resizeObj)
}
