/*********************************************************************************
WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Tamim Khaleeq
Student ID: 173107228
Date: 2024-06-15
Vercel Web App URL: https://vercel.com/new/atkhaleeqs-projects/success?developer-id=&external-id=&redirect-url=&branch=master&deploymentUrl=web322-i430787gs-atkhaleeqs-projects.vercel.app&projectName=web322-app&s=https%3A%2F%2Fgithub.com%2Fatkhaleeq%2Fweb322-app&gitOrgLimit=&hasTrialAvailable=1&totalProjects=1&slug=app-future&slug=en-US&slug=new&slug=atkhaleeqs-projects&slug=success 
GitHub Repository URL:  atkhaleeq/web322-app

********************************************************************************/ 

const express = require('express');
const path = require('path');
const store = require('./store-service');
const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.static(__dirname + '/public'));


store.initialize()
    .then(() => {
        console.log('initialization was successful');

        // Different Routes
        app.get('/', (req, res) => {
            res.redirect('/about');
        });

        app.get('/about', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'about.html'));
        });

        app.get('/shop', (req, res) => {
            store.getPublishedItems()
                .then(items => res.json(items))
                .catch(err => res.status(404).json({ message: err }));
        });

        app.get('/items', (req, res) => {
            store.getAllItems()
                .then(items => res.json(items))
                .catch(err => res.status(404).json({ message: err }));
        });

        app.get('/categories', (req, res) => {
            store.getCategories()
                .then(categories => res.json(categories))
                .catch(err => res.status(404).json({ message: err }));
        });

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
