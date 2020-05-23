const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//routes import
const AdminRoutes = require('./routes/adminRoutes');
const StudentRoutes = require('./routes/studentRoutes');
const AuthRoutes = require('./routes/authRoutes');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret:'nodeApp', saveUninitialized: false, resave:false, useFindAndModify: false}));

app.use(AuthRoutes);
app.use(StudentRoutes);
app.use('/admin', AdminRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    if(req.session.isLoggedIn !== true){
        res.render('index', {pageTitle: "courseRus.com", pagePath:"/", session_data: req.session});    // render a common index page
    }
    else{
        if(req.session.mode == "student"){
            res.render('student/home', {pageTitle: "Home", pagePath:"/", session_data: req.session});
        }
        else{
            res.redirect('/admin');
        }
    }
});

app.use((req, res)=>{
    res.render('includes/404', {pageTitle: "404", pagePath:"404", session_data: req.session})
});

app.listen(9000);

mongoose.connect('mongodb+srv://owner:owner@nodeapp-oke9f.mongodb.net/test?authSource=admin&replicaSet=nodeApp-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Connected at 9000!');
})
.catch((err)=>{
    console.log('Error in connecting to database!');
    // console.log(err);
});
