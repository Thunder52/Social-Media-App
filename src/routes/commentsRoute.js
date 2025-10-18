const router=require('express').Router();
const authenticate=require('../middleware/authMiddleware.js');
const {addComment}=require('../controller/commentController.js')

router.post('/comment',authenticate,addComment);


module.exports=router;