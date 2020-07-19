const express = require('express');
//for heroku env
const port =process.env.POST || 5000;
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
require('../models/user');
require('../models/post');
mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
    console.log('mongo is connected');
});
mongoose.connection.on('error',(err)=>{
    console.log('error connecting',err);
});
mongoose.model('User');
app.use(require('../routes/auth'));
app.use(require('../routes/post'));
app.use(require('../routes/user'));
app.listen(port,()=>{
console.log(`this app is listening to port ${port}`);
});