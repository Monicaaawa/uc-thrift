const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.set('strictQuery', false);

const app = express();
app.use(express.json());
app.use(cors());

connection = "mongodb+srv://<username>:<password>@ucthrift-dev.xpujbsq.mongodb.net/"

mongoose
    .connect (connection,
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        }
    )
    .then (() => console. log("Connected to DB"))
    .catch (console.error);