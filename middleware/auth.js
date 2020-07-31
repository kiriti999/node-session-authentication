// https://github.com/auth0/node-jsonwebtoken
// refresh token: https://github.com/jppellerin/node-jsonwebtoken#jwtrefreshtoken-expiresin-secretorprivatekey--callback
// expiry: https://github.com/vercel/ms
const mongoose = require('mongoose');
const cs = require('../constants');
const HttpStatus = require('http-status-codes');
const APIError = require('../error-handle');

const secret = 'secure@123';

const auth = {
    secure(payload) {
        return jwt.sign({ data: payload }, secret, { expiresIn: cs.TOKEN_EXPIRY });
    },

    verify(req, res, next) {
        try {
            if (req.session && req.session.id) {
                next();
            } else {
                throw new APIError(cs.NO_SESSION, HttpStatus.UNAUTHORIZED);
            }
        } catch (err) {
            next(err);
        }
    }
};

module.exports = auth;
