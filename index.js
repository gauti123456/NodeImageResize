const express = require('express')
const bodyparser = require('body-parser')
const multer = require('multer')
const path = require('path')
const imagesize = require('image-size')
const gm = require('gm')

const app = express()

app.use(bodyparser.json())
app.use('/uploads', express.static(path.join(__dirname + '/uploads')));


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads')
    },
    filename: function (req, file, cb) {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage:storage
})

app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine','ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', upload.single('image'), (req, res, next) => {
    const dimensions = imagesize(req.file.path)
    res.render('image.ejs',{url:req.file.path,name:req.file.filename,width:dimensions.width,height:dimensions.height})
})

app.post('/resize/:path', (req, res) => {
    var width = req.body.width;
    var height = req.body.height;
    console.log(width)
    var image = req.params.path
    console.log(image)

    gm('uploads/' + image)
        .resize(width, height)
        .write("output.png", function (err) {
            if (err) res.send(err)
            res.download("output.png")
    })
})

app.listen(5000, () => {
    console.log("Server is listening on Port 5000")
})