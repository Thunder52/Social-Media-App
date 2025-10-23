const router=require('express').Router();
const authenticate=require('../middleware/authMiddleware.js');
const {addComment,updateComment,deleteComment}=require('../controller/commentController.js')

router.post('/comment',authenticate,addComment);
router.post('/update-comment/:id',authenticate,updateComment);
router.get('/delete-comment/:id',authenticate,deleteComment);

module.exports=router;