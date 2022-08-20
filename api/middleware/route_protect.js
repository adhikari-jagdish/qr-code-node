const jwt = require('jsonwebtoken');
const UserToken = require('../model/refresh_token_model');
const JwtAuthUtils = require("../common/jwt_auth_utils");
const secretKey = process.env.SECRET_KEY;

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const token = authHeader.split('Bearer ')[1];
            const decodedToken = jwt.decode(token, secretKey);
            if (decodedToken) {
                if (Date.now() >= decodedToken.exp * 1000) {
                    console.log('token expired');
                    // console.log('decoded token: ', decodedToken);
                    const userId = decodedToken.id;
                    const tokenModel = await UserToken.findOne({user: userId}).populate({
                        path: 'user',
                    });
                    if (tokenModel) {
                        const refreshToken = tokenModel.refreshToken;
                        jwt.verify(refreshToken, secretKey, async (err, payload) => {
                            if (err) {
                                await tokenModel.delete();
                                return res.status(401).json({
                                    message: 'Sorry, token invalid or already expired!'
                                });
                            }
                            if (Date.now() >= payload.exp * 1000) {
                                console.log('refresh token expired');
                                await tokenModel.delete();
                                return res.status(401).json({
                                    message: 'Sorry, token already expired!'
                                });
                            } else {
                                console.log('refresh token not expired');
                                const generatedTokens = await JwtAuthUtils.generateJwtTokens(userId);

                                await UserToken.findOneAndUpdate({user: userId}, {
                                    token: generatedTokens.token,
                                    refreshToken: generatedTokens.refreshToken,
                                    user: userId,
                                });
                                res.setHeader("Access-Control-Expose-Headers", "authorization");
                                res.header('authorization', 'Bearer ' + generatedTokens.token);
                                next();
                            }
                        });
                    } else {
                        console.log('Logged out from the system');
                        return res.status(401).json({
                            message: 'Sorry, you are already logged out from our system. Please login again.',
                            logout: true,
                        });
                    }
                } else {
                    console.log('token not expired so go next');
                    next();
                }
            } else {
                return res.status(401).json({
                    message: 'Sorry, unauthorized access!'
                });
            }
        } catch (e) {
            return res.status(401).json({
                message: 'Sorry, unauthorized access!'
            });
        }
    } else {
        return res.status(401).json({
            message: 'Sorry, unauthorized access!'
        });
    }
};
