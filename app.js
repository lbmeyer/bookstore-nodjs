const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

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

app.use((req, res, next) => {
  User.findById(1)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

/**
 * Create Associations with our models
 * @param  {} User  
 * @param  constraints: true --> userId foreign key in the Products table must reference a key from the Users table
 * @param  onDelete: 'CASCADE' --> if a user is deleted, any products related to that user will also be deleted
 * @param  through: CartItem --> tell Sequelize where Cart/Product connections should be stored (CartItem)
 */
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// Create our tables
sequelize
  // force table overwrite in dev environment
  // .sync({ force: true })
  .sync()
  .then(result => {
    return User.findById(1);
  })
  // .then(user => {
  //   if (!user) {
  //     return User.create({ name: 'Louis', email: 'test@test.com' })
  //   }
  //   // return a promise to keep it consistent
  //   // return Promise.resolve(user); --> same as writing:
  //   return user;
  // })
  // .then(user => {
  //   return user.createCart();
  // })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
