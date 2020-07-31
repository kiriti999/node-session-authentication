const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const cs = require('../constants');
const User = require('../model/User');
const auth = require('../middleware/auth');
const HttpStatus = require('http-status-codes');
const APIError = require('../error-handle');

/**
 * @method - POST
 * @param - /register
 * @description - User registration
 */
router.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            throw new APIError(cs.USER_EXISTS, HttpStatus.NOT_FOUND);
        }

        user = new User({ username, email, password });
        await user.save();

        const token = user._id;
        req.session.save(function (err) {
            if (err) {
                throw new APIError(cs.SESSION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            req.session.userId = token;
            res.status(200).json({ id: token, token });
        });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });

        if (!user) throw new APIError(cs.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new APIError(cs.INVALID_PASSWORD, HttpStatus.NOT_FOUND);

        const token = user._id;
        req.session.save(function (err) {
            if (err) {
                throw new APIError(cs.SESSION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            req.session.userId = token;
            res.status(200).json({ id: token, token });
        });
    } catch (err) {
        next(err);
    }
});

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/me
 */
router.get('/profile/:id', auth.verify, async (req, res, next) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.params.id);
        const token = req['token'] || '';
        const { _id, username, email } = user;
        token ? res.status(200).json({ _id, username, email, token }) : res.json(user);
    } catch (err) {
        next(err);
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.clearCookie('connect.sid');
        // res.cookie('connect.sid', '', { expires: new Date() });
        console.log('');
        console.log('after log out...');
        console.log('');
        console.log('logout session:', req.session);
        console.log('cookie:', req.get('cookie'));
        res.send('logged out');

        // res.redirect('/');
    })
});

module.exports = router;
