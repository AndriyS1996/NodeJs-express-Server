
const router = require('express').Router();
const verify_token_mw = require('./verify_token');


router.get('/profile', verify_token_mw, (req, res) => {
    req.user.customStyles = '<link rel="stylesheet" href="styles/profile.css">'
    res.render('profile.handlebars', req.user);
})

module.exports = router;