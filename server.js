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

        // Startint the server
        app.listen(PORT, () => {
            console.log(`Express listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(`initialization failed: ${err}`);
    });
