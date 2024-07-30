	const Sequelize = require('sequelize');
	var sequelize = new Sequelize('database', 'user', 'password', {
    host: 'host',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Item = sequelize.define('Item',{
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    itemDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
    price: Sequelize.DOUBLE

});

const Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Item.belongsTo(Category, {foreignKey: 'category'});


const initialize = () => {
    return new Promise((resolve, reject) => {
      reject();
    });
};

const getAllItems = () => {
    return new Promise((resolve, reject) => {
        reject();
    });
};

const getPublishedItems = () => {
    return new Promise((resolve, reject) => {
        reject();
    });
};


const getPublishedItemsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        reject();
    });
};



const getCategories = () => {
    return new Promise((resolve, reject) => {
        reject();
    });
};

const addItem = (itemData) => {
    return new Promise((resolve) => {
        reject();
    });
};


const getItemsByCategory = (category)  =>{
    return new Promise ((resolve, reject)=>{
        const arr = items.filter(function(item){

            return item.category === parseInt(category);
        });
        if (arr.length > 0){
            resolve(arr);
        }
        else{
            reject("nothing returned");
        }

    });
};

function getItemsByMinDate(minDateStr){
    return new Promise ((resolve, reject)=>{
        reject();
    });
};

const getItemById = (id) =>{
    return new Promise((resolve, reject)=>{
        reject();
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
