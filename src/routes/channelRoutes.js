const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');

// Define routes
// router.get('/', userController.getAllItems);
// router.get('/:id', itemController.getItemById);
// router.post('/', itemController.createItem);
// router.put('/:id', itemController.updateItem);
// router.delete('/:id', itemController.deleteItem);


router.post('/create', channelController.postCreateChannel);
router.get('/get/:id', channelController.getGetChannelById);
router.get('/getall', channelController.getGetAll);
router.put('/update/:id', channelController.putUpdateChannel);

module.exports = router;
