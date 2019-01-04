const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Use templating engine
app.set('view engine', 'pug');
// Default location of views 
// (not explicitly required if views folder is in root and called 'views')
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
// statically point to css folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

app.listen(3000);
