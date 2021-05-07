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


const app = express();
const PORT = process.env.PORT || 5005;
const store = new MongoDBStore({
  uri: process.env.MongoURL,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  } 
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
      .catch(err => console.log(err));
  });


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);



mongoose.connect(
    process.env.MongoURL, 
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
    )
     .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'CiHakT0r',
          email: 'ciamax@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });


