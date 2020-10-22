
const router = require('express').Router();
const verify_token_mw = require('./verify_token');
const User = require('../model/User');
const PrivateChat = require('../model/PrivateChat');


router.get('/profile', verify_token_mw, async (req, res) => {
    let user = await User.findOne({name: req.user.name}).exec();
    user.customStyles = '<link rel="stylesheet" href="styles/profile.css">';
    res.render('profile.handlebars', user);
});

router.post('/profile/createPrivateChat', verify_token_mw, async (req, res) => {
    //find user by name
    try {
        const user = await User.findOne({name: req.body.name}).exec();
        if (!user) return res.status(400).send('User not found');
    } catch (error) {
        res.status(500).send(error);
        res.end();
    };


    //create privat chat

    const privateChat = new PrivateChat({
        admin: req.user.name,
        guest: req.body.name,
        history: []
    });

    //save private chat

    try {
        await privateChat.save();
        await User.updateOne({name: req.user.name}, {$push: {privateChats: [req.user.name + '&' + req.body.name]}});
        await User.updateOne({name: req.body.name}, {$push: {privateChats: [req.user.name + '&' + req.body.name]}});
        res.status(201).send({name: req.body.name, chatHistory: []});
        res.end();
    } catch (error) {
        res.status(500).send(error);
        res.end();
    }

});

router.get('/profile/getPrivateChats', verify_token_mw, async (req, res) => {
    let allUserPrivateChats = await PrivateChat.find({$or: [{admin: req.user.name}, {guest: req.user.name}]}).exec();
    let privateChats = [];
    allUserPrivateChats.forEach((chat) => {
        privateChats.push({name: req.user.name === chat.admin ? chat.guest : chat.admin, history: chat.history});
    })
    res.status(200).send({privateChats: privateChats, myName: req.user.name});
    res.end();
});

module.exports = router;