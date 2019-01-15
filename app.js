const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const app = express();

// Use templating engine
app.set('view engine', 'ejs');
// app.set('view engine', 'pug');

// Default location of views
// (not explicitly required if views folder is in root and called 'views')
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({ extended: false }));
// statically point to css folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Create our tables
sequelize
  .sync()
  .then(result => {
    console.log('Created Product');
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
