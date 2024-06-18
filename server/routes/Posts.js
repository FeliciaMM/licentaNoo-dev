const express = require('express');
const router = express.Router();
const {Posts} = require("../models/index");
const {validateToken} = require("../middlewares/AuthMiddleware.js");
const jwt = require("jsonwebtoken");

router.get('/', async (req, res) => {
    const listOfPosts = await Posts.findAll();
    res.json(listOfPosts);
});

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
});

router.get('/posts', validateToken(), async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; // Get token from authorization header
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Decode the token

    const userId = decoded.id; // Extract user id from the decoded token
    const listOfPosts = await Posts.findAll({where: {UserId: userId}});
    res.json(listOfPosts);

});

router.post('/', validateToken(), async (req, res) => {
    const post = req.body;
    post.username = req.user.username;
    post.UserId = req.user.id;
    await Posts.create(post);
    res.json(post);
});

module.exports = router;