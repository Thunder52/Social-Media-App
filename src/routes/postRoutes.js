const router=require('express').Router();
const {getCreatePost,createPost,getHome,updatePost,deletePost,getUpdate} =require('../controller/postController.js');
const authenticate=require('../middleware/authMiddleware.js')
const upload=require('../config/upload.js')

router.get('/create',authenticate,getCreatePost);
router.post('/create',upload.single('image'),authenticate,createPost);
router.get('/home',authenticate,getHome)
router.get('/update/:id',authenticate,getUpdate);
router.post('/update/:id',authenticate,updatePost);
router.get('/delete/:id',authenticate,deletePost);


module.exports=router;