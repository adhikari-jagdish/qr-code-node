const express = require('express');
const router = express.Router();
const QrAmountController = require('../controller/qr_amount_controller');
const tokenValidator = require('../middleware/route_protect');


router.post('/updateQrAmount', tokenValidator, QrAmountController.updateQrAmount);
router.post('/getQrAmountByUser', tokenValidator, QrAmountController.getQrAmountByUser);

module.exports = router;