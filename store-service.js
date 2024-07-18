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


const getPublishedItemsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        const publishedItemsCat = items.filter(item => item.published=== true && item.category === category);
        if (publishedItemsCat.length === 0) {
            reject(`Rejected, items length is zero`);
        } else {
            resolve(publishedItemsCat);
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

const addItem = (itemData) => {
    return new Promise((resolve) => {
        if (itemData.published!==undefined) {
            itemData.published = true;
        }
        else{
            itemData.published = false;
        }
        if(items.length > 0){
            itemData.id = items.length+1;
        }
        else{
            itemData.id = 1;
        }
        items.push(itemData);
        resolve(itemData);
    });
};


function getItemsByCategory(category) {
    return new Promise ((resolve, reject)=>{
         // using built-in function filter and saving the result in arr. we can alternatively use a for loop.
        let arr = items.filter(itemsCat => itemsCat.category === category);
        if (arr.length === 0){
            reject("no results returned");
        }
        else{
            resolve(arr);
        }

    });
};

function getItemsByMinDate(minDateStr){
    return new Promise ((resolve, reject)=>{
        let arr2 = [];
        let i = 0;
        // going through each element of the items and comparing the date. we can alternatively use filter.
        for(; i< items.length; i++){
            if (new Date(items[i].postDate) >= new Date(minDateStr)){
                arr2.push(items[i]);
            }
        }
        if (arr2.length === 0){
            reject("no results returned");
        }
        else{
            resolve(arr2);
        }
    });
};

function getItemById(id){
    return new Promise((resolve, reject)=>{
        let arr3 = items.filter(obj => obj.id === id);
        if (arr2.length === 0){
            reject("no results returned");
        }
        else{
            resolve(arr2);
        }
    });  
};


module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories,
    addItem,
    getItemsByCategory,
    getItemsByMinDate,
    getItemById,
    getPublishedItemsByCategory

};
