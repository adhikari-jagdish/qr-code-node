const express = require('express');
const router = express.Router();
const QrAmountController = require('../controller/qr_amount_controller');
const tokenValidator = require('../middleware/route_protect');


router.post('/updateQrAmount', tokenValidator, QrAmountController.updateQrAmount);
router.get('/getQrAmountByUser/:id', QrAmountController.getQrAmountByUser);

module.exports = router;