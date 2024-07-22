/*********************************************************************************
WEB322 – Assignment 04
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
const itemData = require("./store-service");
const PORT = process.env.PORT || 8080;

cloudinary.config({
    cloud_name: 'dnt5znj9m',
    api_key: '372148929547974',
    api_secret: '0rK-uaooCe_7hHS43Y_k2j3yaR0',
    secure: true
});


app.engine(".hbs", exphbs.engine({extname: ".hbs"}));
app.set("view engine", ".hbs");



const upload = multer(); 

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});


app.engine('.hbs', exphbs.engine({extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
            return (
                '<li class="nav-item"><a ' +
                (url == app.locals.activeRoute ? ' class="nav-link active"' : ' class="nav-link"') +
                ' href="' + url + '">' + options.fn(this) + '</a></li>'
            );
        }
    }
}));





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
app.set('views', path.join(__dirname, 'views'));

store.initialize()
    .then(() => {
        console.log('initialization was successful');

        // Different Routes
    

        app.get('/', (req, res) => {
            res.redirect('/shop');
        });

        app.get('/about', (req, res) => {
            res.render('about');
        });

     
app.get("/shop", async (req, res) => {
    // Declare an object to store properties for the view
    let viewData = {};
  
    try {
      // declare empty array to hold "item" objects
      let items = [];
  
      // if there's a "category" query, filter the returned items by category
      if (req.query.category) {
        // Obtain the published "item" by category
        items = await itemData.getPublishedItemsByCategory(req.query.category);
      } else {
        // Obtain the published "items"
        items = await itemData.getPublishedItems();
      }
  
      // sort the published items by itemDate
      items.sort((a, b) => new Date(b.itemDate) - new Date(a.itemDate));
  
      // get the latest item from the front of the list (element 0)
      let item = items[0];
  
      // store the "items" and "item" data in the viewData object (to be passed to the view)
      viewData.items = items;
      viewData.item = item;
    } catch (err) {
      viewData.message = "no results1";
    }
  
    try {
      // Obtain the full list of "categories"
      let categories = await itemData.getCategories();
  
      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
    } catch (err) {
      viewData.categoriesMessage = "no results1";
    }
  
    // render the "shop" view with all of the data (viewData)
    res.render("shop", { data: viewData });
  });

  
app.get('/shop/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};
  
    try{
  
        // declare empty array to hold "item" objects
        let items = [];
  
        // if there's a "category" query, filter the returned items by category
        if(req.query.category){
            // Obtain the published "items" by category
            items = await itemData.getPublishedItemsByCategory(req.query.category);
        }else{
            // Obtain the published "items"
            items = await itemData.getPublishedItems();
        }
  
        // sort the published items by itemDate
        items.sort((a,b) => new Date(b.itemDate) - new Date(a.itemDate));
  
        // store the "items" and "item" data in the viewData object (to be passed to the view)
        viewData.items = items;
  
    }catch(err){
        viewData.message = "no results2";
    }
  
    try{
        // Obtain the item by "id"
        viewData.item = await itemData.getItemById(req.params.id);
    }catch(err){
        viewData.message = "no results2"; 
    }
  
    try{
        // Obtain the full list of "categories"
        let categories = await itemData.getCategories();
  
        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results2"
    }
  
    // render the "shop" view with all of the data (viewData)
    res.render("shop", {data: viewData})
  });


  app.get('/items', (req, res) => {
    let category = req.query.category;
    let minDate = req.query.minDate;
    if(category){
        store.getItemsByCategory(category)
        .then(items => res.render('items', {items: items}))
        .catch(err => res.render('items', { message: err }));
    }
    else if (minDate){
        store.getItemsByMinDate(minDate)
        .then(items => res.render('items', {items: items}))
        .catch(err => res.render('items', { message: err }));
    }
    else{
        store.getAllItems()
        .then(items => res.render('items', {items: items}))
        .catch(err => res.render('items', { message: err }));
    }
});



app.get('/categories', (req, res) => {
    store.getCategories()
        .then(categories =>  res.render('categories', {categories: categories}))
        .catch(err => res.render('categories', { message: err }));
});

app.get('/items/add', (req, res) => {
    res.render('addItem');            
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
    console.log(`Express listening on port ${PORT}`);});
    })
    .catch(err => {
        console.error(`initialization failed: ${err}`);
    });
