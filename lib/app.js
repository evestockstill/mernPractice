/* eslint-disable no-undef */
const express = require('express');
const app = express();


app.use(express.json({ extended: false }));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
module.exports = app;
