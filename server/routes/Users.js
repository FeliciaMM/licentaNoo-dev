const express = require('express');
const router = express.Router();
const {Users} = require("../models/index");
const bcrypt = require('bcrypt');
const { validateToken } = require('../middlewares/AuthMiddleware.js');
const {body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const {ProfileImage} = require("../models");

require('dotenv').config();

router.post('/register', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('role').isIn(['admin', 'user']).withMessage('Invalid role'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {username, password, email, role} = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await Users.create({
            username: username,
            password: hash,
            email: email,
            role: role,
        });
        res.json("User created");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const { username, password } = req.body;

    try {
        const user = await Users.findOne({where: {username: username}});
        if (!user) {
            return res.status(401).json({error: "No such user"});
        }

        bcrypt.compare(password, user.password).then((same) => {
            if (!same) {
                return res.status(401).json({error: "Wrong username and/or password"});
            }

            // Generate JWT token
            const accessToken = jwt.sign(
                {username: user.username, id: user.id, role: user.role},
                process.env.ACCESS_TOKEN_SECRET // Use secret from environment variable
            );

            res.json({token: accessToken, username: username, id: user.id});
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get("/userDetails", validateToken(), async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; // Get token from authorization header
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Decode the token

    const userId = decoded.id; // Extract user id from the decoded token

    try {
        const basicInfo = await Users.findByPk(userId, {
            attributes: {exclude: ['password']},
            include: [{
                model: ProfileImage,
                where: {isActive: true},
                attributes: ['base64Image'],
                required: false
            }]
        });
        if (!basicInfo) {
            return res.status(404).json({error: "User not found"});
        }
        res.json(basicInfo);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.post('/upload', validateToken(), async (req, res) => {
    const {base64Image} = req.body;
    const token = req.headers.authorization.split(" ")[1]; // Get token from authorization header
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Decode the token

    const userId = decoded.id; // Extract user id from the decoded token

    try {
        // Deactivate old images
        await ProfileImage.update({isActive: false}, {where: {userId, isActive: true}});

        // Save new image
        const profileImage = await ProfileImage.create({userId, base64Image, isActive: true});
        res.json(profileImage);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});



module.exports = router;
