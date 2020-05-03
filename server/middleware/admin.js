const { User } = require('../models/User');

let admin = (req, res, next) => {
    let token = req.cookies.w_auth;

    User.findOne({ role: 1 }, (err, user) => {
        if (err) throw err;
        if (!user)
            return res.json({
                isAuth: false,
                error: true
            });
        req.user = user;
        next();
    })
};

module.exports = { admin };
