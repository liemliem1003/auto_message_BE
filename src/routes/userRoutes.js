const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes
// router.get('/', userController.getAllItems);
// router.get('/:id', itemController.getItemById);
// router.post('/', itemController.createItem);
// router.put('/:id', itemController.updateItem);
// router.delete('/:id', itemController.deleteItem);


router.post('/login', userController.postLogin);
module.exports = router;
