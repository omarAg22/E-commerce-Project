const express = require('express');
const userRoutes = require('./routes/userRoutes');
const costumerRoutes = require('./routes/customerRoutes');
const categoryRoutes = require('./routes/categorieRoutes');
const subCategoryRoutes = require('./routes/subcategorieRoutes');
const productsRoutes = require('./routes/productRoutes');
const ordersRoutes = require('./routes/orderRoutes');
const { default: mongoose } = require('mongoose');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const _PORT = process.env.PORT || 6000;

const app = express();
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use(express.json());
app.use('/users', userRoutes);
app.use('/costumers', costumerRoutes);
app.use('/categories', categoryRoutes);
app.use('/subCategories', subCategoryRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(_PORT, () => {
      console.log(`server running on ${_PORT} and database connected`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
