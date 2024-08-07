	const Sequelize = require('sequelize');
	var sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'UedvM9Fln3RQ', {
    host: 'ep-autumn-darkness-a5ztetgv.us-east-2.aws.neon.tech',
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

        sequelize.sync()
        .then(()=> resolve())
        .catch(error => reject ("unable to sync the database"));
    });
};
 
const getAllItems = () => {
    return new Promise((resolve, reject) => {
        Item.findAll().then(data => resolve(data)).catch (error => reject ("no results returned"));
    });
};

const getPublishedItems = () => {
    return new Promise((resolve, reject) => {
        Item.findAll({
            where: {published: true}

        })
        .then(data => resolve(data))
        .catch (error => reject ("no results returned"));
      
    });
};


const getPublishedItemsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Item.findAll({
            where: {published: true, category: category}

        })
        .then(data => resolve(data))
        .catch (error => reject ("no results returned"));
      
        
    });
};



const getCategories = () => {
    return new Promise((resolve, reject) => {
        Category.findAll()
        .then(data => resolve(data))
        .catch (error => reject ("no results returned"));
    });
};

const addItem = (itemData) => {
    return new Promise((resolve) => {
        itemData.published = (itemData.published) ? true : false;
        for(let i in itemData){
            if(itemData[i]===""){
                itemData[i]=null;
            }
        }
        itemData.itemData = new Date();

        Item.create(itemData)
        .then(data => resolve(data))
       .catch (error => reject ("unable to create item"));
    });
};


const getItemsByCategory = (category)  =>{
    return new Promise ((resolve, reject)=>{
       Item.findAll({where: {category: category}})
       .then(data => resolve(data))
       .catch (error => reject ("no results returned"));
    });
};

function getItemsByMinDate(minDateStr){
    const { gte } = Sequelize.Op;
    return new Promise ((resolve, reject)=>{
        Item.findAll({
            where: {
                itemDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        })
        .then(data => resolve(data))
       .catch (error => reject ("no results returned"));

    });
};

const getItemById = (id) =>{
    return new Promise((resolve, reject)=>{
        Item.findAll({where: {id: id}})
        .then(data => resolve(data[0]))
        .catch (error => reject ("no results returned"));
    });  
};


// new functions**********
const addCategory = (categoryData) => {
    return new Promise((resolve, reject)=>{
        for (let i in categoryData){
            if (categoryData[i]===""){
                categoryData[i] = null;
            }
        }
        Category.create(categoryData)
        .then(()=> resolve(categoryData))
        .catch(error => reject("cant add category"));
    });
};



const deleteCategoryById = (id) => {
    return new Promise((resolve, reject)=>{
        Category.destroy({where: {id: id}}).then(()=>resolve()).catch(error => reject ("cant remove category"));
    })
}

const deleteItemById = (id) => {
    return new Promise((resolve, reject)=>{
        Item.destroy({where: {id: id}}).then(()=>resolve()).catch(error => reject ("cant remove Item"));

    })
}


module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories,
    addItem,
    getItemsByCategory,
    getItemsByMinDate,
    getItemById,
    getPublishedItemsByCategory,
    addCategory,
    deleteCategoryById,
    deleteItemById

};
