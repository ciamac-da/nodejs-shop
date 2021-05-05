if(process.env.NODE_ENV !== "production")
require("dotenv").config()
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const mongoose = require("mongoose")
/* const rootDir = require("./util/path"); */

const app = express();
const PORT = process.env.PORT || 5005;

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);



mongoose.connect(
    process.env.MongoURL, 
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
    )
    .then(result => {
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err)
    })



