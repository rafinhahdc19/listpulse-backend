const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express()
const cookieParser = require('cookie-parser');
const PORT = 3001

const limiter = rateLimit({
    windowMs: 5000,
    max: 30,
    message: 'Muitas requisições, seja mais devagar.',
  });
app.use(limiter);
app.use(cors({
    origin: process.env.FRONTEND,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(helmet());
app.use(cookieParser());
app.use(express.json())
app.use(routes)


app.listen(PORT, () => {
    console.log("listening on port 3001")
})