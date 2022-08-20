const User = require('../model/user_model');
const bcrypt = require('bcrypt');
const UserToken = require('../model/refresh_token_model');
const JwtAuthUtils = require("../common/jwt_auth_utils");

exports.login = async (req, res, next) => {

    let cond = {
        $or: [{
            email: req.body.username
        }, {
            mobileNumber: req.body.username
        }]
    };
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: "Invalid Request Body"
        });
    }

    let user = await User.find(cond);
    if (user.length < 1) {
        return res.status(404).json({
            statusCode: false,
            message: 'User does not exist!'
        });
    }
    bcrypt.compare(req.body.password, user[0].password, async (err, result) => {
        if (result) {
            const generatedTokens = await JwtAuthUtils.generateJwtTokens(user[0]._id);
            const oldTokenModel = await UserToken.findOne({user: user[0]._id});
            if (oldTokenModel) {
                await oldTokenModel.delete();
            }
            await UserToken.create({
                token: generatedTokens.token,
                refreshToken: generatedTokens.refreshToken,
                user: user[0],
            });
            res.setHeader("Access-Control-Expose-Headers", "authorization");
            res.header('authorization', 'Bearer ' + generatedTokens.token);
            return res.status(200).json({
                message: 'Auth Success!',
                data: user[0]
            });
        } else {
            return res.status(403).json({
                message: 'Auth Failed! Try again or click Forgot password to reset it.'
            });
        }

    });
}

exports.signup = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: 'Invalid Request Body'
        });
    }
    let userTypeHost = "H0QC";
    if (req.body.userType !== null && req.body.userType !== undefined) {
        let user = await User.find({
            $or: [
                {mobileNumber: req.body.mobileNumber},
                {email: req.body.email},
            ]
        });
        if (req.body.userType === userTypeHost) {
            user = await User.find({
                $or: [
                    {mobileNumber: req.body.mobileNumber},
                    {userType: userTypeHost},
                    {email: req.body.email},
                ]
            });
        }

        if (user != null && user.length >= 1) {
            return res.status(409).json({
                message: 'User Already Exists!'
            });
        }
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        if (!passwordHash) {
            return res.status(400).json({
                message: 'Error in Hashing Password'
            });
        }
        user = new User({
            fullName: req.body.fullName,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            userType: req.body.userType,
            password: passwordHash
        });
        await user.save();
        const generatedTokens = await JwtAuthUtils.generateJwtTokens(user._id);
        const oldTokenModel = await UserToken.findOne({user: user._id});
        if (oldTokenModel) {
            await oldTokenModel.delete();
        }
        await UserToken.create({
            token: generatedTokens.token,
            refreshToken: generatedTokens.refreshToken,
            user: user,
        });
        res.setHeader("Access-Control-Expose-Headers", "authorization");
        res.header('authorization', 'Bearer ' + generatedTokens.token);
        return res.json({
            message: 'User Created Successfully',
            data: user
        });
    } else {
        return res.status(400).json({
            message: 'User Already Exists!'
        });
    }
}

//get User details
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDetails = await User.findById(userId).lean();
        if (!userDetails) {
            return res.status(404).json({
                message: 'User Not Found!'
            });
        }
        return res.json({
            message: 'User Details!',
            data: userDetails
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong!'
        });
    }
};


exports.checkUserPresenceWithEmail = async (req, res) => {
    try {
        const email = req.params.email;
        let user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found!',
            });
        }
        return res.json({
            message: 'User already exist!',
            data: user,
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong!'
        });
    }
}


exports.checkUserPresenceWithMobileNumber = async (req, res) => {
    try {
        const mobileNumber = req.params.mobileNumber;
        let user = await User.findOne({mobileNumber: mobileNumber});
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found!',
                data: {}
            });
        }
        return res.json({
            message: 'User already exist!',
            data: user,
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong!'
        });
    }
}
