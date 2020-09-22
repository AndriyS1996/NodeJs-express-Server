
const router = require('express').Router();


router.get('/logout', (req, res) => {
    res.clearCookie('JWT', {
        httpOnly: true,
    });
    res.status(205);
    res.redirect('back');
});

module.exports = router;