/*********************************************************************************
WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Tamim Khaleeq
Student ID: 173107228
Date: 2024-07-5
Vercel Web App URL: https://vercel.com/atkhaleeqs-projects/web322-app
GitHub Repository URL:  atkhaleeq/web322-app

********************************************************************************/ 

const express = require('express');
const path = require('path');
const store = require('./store-service');
const app = express();
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 8080;

cloudinary.config({
    cloud_name: 'dnt5znj9m',
    api_key: '372148929547974',
    api_secret: '0rK-uaooCe_7hHS43Y_k2j3yaR0',
    secure: true
});

app.set("view engine", ".hbs");
app.engine(".hbs", exphbs.engine({extname: ".hbs"}));

const upload = multer(); 


app.post('/items/add', upload.single('featureImage'), function (req, res, next) {
    if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
    
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }
    
        upload(req).then((uploaded)=>{
            processItem(uploaded.url);
        });
    }else{
        processItem("");
    }
     
    function processItem(imageUrl){
        req.body.featureImage = imageUrl;
        store.addItem(req.body)
            .then(() => {
                res.redirect('/items');
    });
    
    } 
});


app.use(express.static(__dirname + '/public'));


store.initialize()
    .then(() => {
        console.log('initialization was successful');

        // Different Routes
        app.get('/', (req, res) => {
            res.redirect('/about');
        });

        app.get('/about', (req, res) => {
            res.render('about');
        });

        app.get('/shop', (req, res) => {
            store.getPublishedItems()
                .then(items => res.json(items))
                .catch(err => res.status(404).json({ message: err }));
        });

        app.get('/items', (req, res) => {
            let category = req.query.category;
            let minDate = req.query.minDate;
            if(category){
                store.getItemsByCategory(category)
                .then(items => res.json(items))
                .catch(err => res.status(404).json({ message: err }));
            }
            else if (minDate){
                store.getItemsByMinDate(minDate)
                .then(items => res.json(items))
                .catch(err => res.status(404).json({ message: err }));
            }
            else{
                store.getAllItems()
                .then(items => res.json(items))
                .catch(err => res.status(404).json({ message: err }));
            }
        });

        app.get('/categories', (req, res) => {
            store.getCategories()
                .then(categories => res.json(categories))
                .catch(err => res.status(404).json({ message: err }));
        });

        app.get('/items/add', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'addItem.html'));
        });

    

        app.get('/items/:id',(req,res)=>{
            let id = req.params.id;
            store.getItemById(id)
            .then(items => res.json(items))
            .catch(err => res.status(404).json({ message: err }));
        })

        app.get('*', (req, res) => {
            res.status(404).send('404 Error :(');
        });

        // Starting the server
        app.listen(PORT, () => {
            console.log(`Express listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(`initialization failed: ${err}`);
    });
