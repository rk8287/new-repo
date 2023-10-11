const express = require('express');
const app = express();
const errMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');


// Load environment variables
dotenv.config({ path: 'backend/config/config.env' });

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(fileUpload());

// Route imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');

app.use('/api/v1',product)
app.use('/api/v1',user)
app.use('/api/v1',order)
app.use('/api/v1',payment)

app.use(cors({
  origin: 'https://your-netlify-app-url.netlify.app', // Replace with your Netlify app URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

// Middleware for handling errors
app.use(errMiddleware);

module.exports = app;
