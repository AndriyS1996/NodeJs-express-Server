
const router = require('express').Router();
const verifyToken = require('./verify_token');


router.get('/', (req, res) => {
    const token = req.cookies.JWT;
    if (token){
        verifyToken(req, res, () =>{return true});
        req.user.registered = true;
        req.user.customStyles = '<link rel="stylesheet" href="styles/main.css">'
        res.render('index.handlebars', req.user);
    } else {
        res.render('index.handlebars', {customStyles: '<link rel="stylesheet" href="styles/main.css">'});
    }
})

module.exports = router;