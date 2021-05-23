const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const validateToken = require('./helper/jwt')
app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(validateToken())
//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const api = process.env.API_URL;

app.use(`/${api}/categories`, categoriesRoutes);
app.use(`/${api}/products`, productsRoutes);
app.use(`/${api}/users`, usersRoutes);
app.use(`/${api}/orders`, ordersRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("Database Connection is ready...",api);
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 3000 
//Server
app.listen(PORT, () => {
  console.log("server is running http://localhost:3000");
});