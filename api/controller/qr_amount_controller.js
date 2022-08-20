const QrAmountModel = require('../model/qr_amount_model');
const ObjectId = require('mongoose').Types.ObjectId;

exports.updateQrAmount = async (req, res) => {
    try {
        const {
            userId,
            amount,
        } = req.body;

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: 'Invalid Request Body'
            });
        } else if (!ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'Invalid User Id'
            });
        }

        let qrAmount = await QrAmountModel.findOne({ userId: userId });
        if (qrAmount) {
            const existingQrAmount = qrAmount.amount;
            if (amount > existingQrAmount) {
                return res.json({
                    message: 'Not enough balance in current user\'s wallet'
                });
            }
            const updatedQrAmount = existingQrAmount - amount;
            await QrAmountModel.findOneAndUpdate({ userId: userId }, { amount: updatedQrAmount }, {
                new: true
            });
            return res.json({
                message: 'QR Amount Updated Successfully'
            });
        }
        return res.json({ message: 'No entry found for user' });

    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong!'
        });
    }
};

exports.getQrAmountByUser = async (req, res) => {
    try {
        const { userId } = req.body;
        let result = await QrAmountModel.find({ 'userId': userId });
        if (result != null && result.length > 0) {
            return res.json({ message: 'Qr Amount listed successfully', data: result });
        } else {
            return res.status(400).json({
                message: 'No Qr amount for user found!'
            });
        }
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong!'
        });
    }
};