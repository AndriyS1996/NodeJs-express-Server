
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const token = req.cookies.JWT;

    if (!token) {
        return res.status(401).send('<h5>You are not registered, go </h5> <a href="/register">register</a> or <a href="/login">log in</a>');
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).send('Invalid token');
    }
}