const express=require('express')
const {connect_to_db}=require('./db/db');
const app=express()
var cookieParser = require('cookie-parser')
const cors=require('cors')
const session = require('express-session');
const { frontend_url } = require('./src/variables');
require('dotenv').config();
console.log('Environment Variables Loaded',frontend_url);
// passport for oAuth login
const passport=require('passport')
// http://localhost:5173
const port=process.env.Port||3800
app.use(cors({
    origin:frontend_url,
    credentials:true
}))
app.use(express.json())
require('./config/passport')
// add session to env
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true
    })
  );
app.use(cookieParser())
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
const path=require("path");
const user = require('./models/user');
const { vectordb } = require('./db/vectordb');
const { recommend_articles } = require('./js_ai/ai_suggestions');


// const migrate_role=async ()=>{
//     try{
//         await user.updateMany({
//             role:{$exists:false}
//         },{
//             $set:{
//                 role:0
//             }
//         }
//         )   
//         console.log("migration completed")
//     }catch(err){    
//         console.log(err)
//     }
// }
// migrate_role()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// route for auth
// public route for articles
app.use('/',require('./routes/public_articles'))
app.use('/auth',require('./routes/authenticate'))
app.use('/reset',require('./routes/password_reset'))
// .......add
app.use(require('./middleware/auth'))
// route for users
app.use('/user',require('./routes/user'))
// private route for articles
app.use('/',require('./routes/private_articles'))
// route for resetting password
app.use(require('./middleware/Error'))
// to doo
// add express limted rate

const start_server=async ()=>{
    try{
        await connect_to_db();
        // connect to vector db
        await vectordb();
        // recommend_articles("technology")
        app.listen(port,()=>{
            console.log('server is running on port 3800')
        })
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

start_server()