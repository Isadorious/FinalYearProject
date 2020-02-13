// This loads values specified in a .env file to process.env.Key
require(`dotenv`).config();

// Import modules
const mongoose = require(`mongoose`);
const express = require(`express`);
const bodyParser = require(`body-parser`);
const logger = require(`morgan`);
const passport = require(`passport`);

// Get environment e.g. dev or production
const environment = process.env.NODE_ENV;

// Setup express
const app = express();
const router = express.Router();

// Setup body parser for reading POST requests that contain a body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

if(environment !== `production`) {
    app.use(logger(`dev`));
};

// Setup API routing
const userRoutes = require(`./backend/routes/user`);
const communityRoutes = require(`./backend/routes/community`);

app.use(`/api/users`, userRoutes);
app.use(`/api/communities`, communityRoutes);

app.listen(process.env.PORT, function() {
    console.log(`Server now listening at localhost:${process.env.PORT}`);
    mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex : true}).catch(function(res){
        console.log(`Failed to connect with the database`);
        console.error(res);
    });
});

module.exports = app;