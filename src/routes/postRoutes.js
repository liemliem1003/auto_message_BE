const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Define routes
// router.get('/', userController.getAllItems);
// router.get('/:id', itemController.getItemById);
// router.post('/', itemController.createItem);
// router.put('/:id', itemController.updateItem);
// router.delete('/:id', itemController.deleteItem);


router.post('/create', postController.postCreatePost);
router.get('/get/:id', postController.getGetPostById);
router.get('/getall', postController.getGetAll);
router.put('/update/:id', postController.putUpdatePost);

module.exports = router;
