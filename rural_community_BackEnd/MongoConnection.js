const mongoose = require('mongoose')
 const ConnectMongo = (req,res)=>{
    mongoose.connect('mongodb://localhost:27017/RCUsers').then(()=>{
        console.log('Mongo DB connected');
        // next()

        
    }).catch((error)=>{
console.log(error,'found in Mongo DB');
res.status(401).send('found some error in Mongo connection')
    })
 }
 module.exports = ConnectMongo