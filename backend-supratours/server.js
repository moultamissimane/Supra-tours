const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const dbConfig = require('./config/dbConfig');

const usersRoute = require('./routes/usersRoutes');

app.use('/api/users', usersRoute);

app.listen(port, () => console.log(`Node server Listening on port ${port}`));