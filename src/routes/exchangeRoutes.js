const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');

// Define routes
router.post('/create', exchangeController.postCreateExchange);
router.get('/get/:id', exchangeController.getGetExchangeById);
router.get('/getall', exchangeController.getGetAll);
router.put('/update/:id', exchangeController.putUpdateExchange);


// router.post('/set-date-time', exchangeController.postSetDateTime);
module.exports = router;
