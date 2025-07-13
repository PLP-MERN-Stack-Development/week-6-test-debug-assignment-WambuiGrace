const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');

const app = express();

app.use(express.json());

app.use('/api/posts', postRoutes);

module.exports = app;