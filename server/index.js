const express = require("express");
const cors = require('cors');
const app = express();
const {sequelize, checkDatabaseConnection} = require('./config/database');
const {Users, Posts, Comments, PetSitterOffers} = require('./models');
const {json} = require("express");
const postRouter = require('./routes/Posts');
const commentsRouter = require('./routes/Comments');
const usersRouter = require('./routes/Users');
const petSittersRouter = require('./routes/PetSitters');

app.use(express.json());
app.use(cors());
app.use(json({ limit: '10mb' }));

app.use('/posts', postRouter);
app.use('/comments', commentsRouter);
app.use('/auth', usersRouter);
app.use('/petsitteroffers', petSittersRouter);

checkDatabaseConnection().then(() => {
    sequelize.sync().then(() => {
        console.log("Database synchronized");
        const PORT = process.env.SERVER_PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(error => {
        console.error('Unable to sync the database:', error);
    });
}).catch(error => {
    console.error('Unable to start the server:', error);
});

module.exports = {Users, Posts, Comments, PetSitterOffers};
