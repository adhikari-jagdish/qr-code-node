const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

exports.generateJwtTokens = (userId) => {
    return new Promise(function (resolve, reject) {
        let tokens = {};
        tokens.token = jwt.sign({id: userId}, secretKey, {expiresIn: '15m', algorithm: "HS256"});
        tokens.refreshToken = jwt.sign({id: userId}, secretKey, {expiresIn: '10d', algorithm: "HS256"});
        resolve(tokens);
    });
}
