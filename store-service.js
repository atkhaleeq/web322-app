const fs = require('fs');
const path = require('path');

let items = [];
let categories = [];

const initialize = () => {
    return new Promise((resolve, reject) => {
        const itemsArrPath = path.join(__dirname, 'data', 'items.json');
        const categoriesArrPath = path.join(__dirname, 'data', 'categories.json');

        // Readint items Json
        fs.readFile(itemsArrPath, 'utf8', (err, data) => {
            if (err) {
                reject(`Can't read files, rejected. ${err.message}`);
                return;
            }
            console.log('Read was okay');
            items = JSON.parse(data);

            // Reading categories Json
            fs.readFile(categoriesArrPath, 'utf8', (err, data) => {
                if (err) {
                    reject(`Can't read files, rejected. ${err.message}`);
                    return;
                }
                console.log('Categories read Okay');
                categories = JSON.parse(data);
                resolve('Initialization okay');
            });
        });
    });
};

const getAllItems = () => {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            reject(`Rejected, items length`);
        } else {
            resolve(items);
        }
    });
};

const getPublishedItems = () => {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published);
        if (publishedItems.length === 0) {
            reject(`Rejected, items length is zero`);
        } else {
            resolve(publishedItems);
        }
    });
};


const getCategories = () => {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            reject(`categories rejected`);
        } else {
            resolve(categories);
        }
    });
};

module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories
};
