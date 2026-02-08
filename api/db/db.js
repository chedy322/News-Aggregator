const mongoose=require('mongoose')
const { MongoClient, ServerApiVersion } = require('mongodb');
const { config } = require('dotenv');
const handle_error = require('../middleware/Error');
const { uri } = require('../src/variables');
require('dotenv').config()


const connect_to_db=async ()=>{
    try{
        await mongoose.connect(uri,{
          serverSelectionTimeoutMS: 30000, // 30 seconds
          socketTimeoutMS: 45000, // 45 seconds
        })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }catch(err){
        console.log(err)
        return
    }
}

module.exports={connect_to_db};