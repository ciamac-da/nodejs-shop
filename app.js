if(process.env.NODE_ENV !== "production")
require("dotenv").config()
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const mongoose = require("mongoose")
const User = require('./models/user');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const csrf = require('csurf');
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5005;
const store = new MongoDBStore({
  uri: process.env.MongoURL,
  collection: 'sessions'
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if(
    file.mimeType === "image/png" ||
    file.mimeType === "image/jpg" || 
    filename.mimeType === "image.jpeg"
    ){
    cb(null, true)
  }else {
    cb(null, false)
  }
}


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage}).single("image"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  } 
  User.findById(req.session.user._id)
    .then(user => {
      if(!user) {
        return next();
      }
      req.user = user;
    })
      .catch(err => { 
      throw new Error(err)  
      });
  });


app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);



mongoose.connect(
    process.env.MongoURL, 
    { useNewUrlParser: true },
    { useUnifiedTopology: true },
    )
     .then(result => {
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });


