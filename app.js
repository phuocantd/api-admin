require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const connectDB = require('./services/database');
const passportConfig = require('./middleware/passport');
const errorHandler = require('./middleware/error');
const cors = require('cors')

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const adminsRouter = require('./routes/admins');
const usersRouter = require('./routes/user');
const tagsRouter = require('./routes/tag');
const specializationsRouter = require('./routes/specialization');

const corsOption = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"]
};

const app = express();
app.use(cors(corsOption));
connectDB();
passportConfig();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/users', usersRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/specializations', specializationsRouter);

app.use(errorHandler);

module.exports = app;
