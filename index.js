const express=require('express')
require('dotenv').config();
const cookieparser=require('cookie-parser');
const session=require('express-session')
const flash=require('connect-flash');
const path=require('path');
const authRoutes=require('./src/routes/authRoutes.js');
const postRoutes=require('./src/routes/postRoutes.js')
const commentRoutes=require('./src/routes/commentsRoute.js');
require('./src/config/db.js')

const app=express();

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(session({resave:true,secret:process.env.MYSECRET,saveUninitialized:false}));
app.use(flash());
app.set('view engine',"ejs");
app.set('views',path.join(__dirname,"/src/views"));
app.use(express.static(path.join(__dirname,'./public')));

app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes);

app.listen(5000,()=>{
    console.log("Server is listening on port 5000");
});