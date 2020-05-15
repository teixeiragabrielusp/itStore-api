const express = require('express');
const equipmentRouter = require('./routers/equipments');

const app = express();

app.use(express.json());
app.use(equipmentRouter);

module.exports = app;