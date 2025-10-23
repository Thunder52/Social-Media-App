const router=require('express').Router();
const {getLogin,getRegister,register,login,logout}=require('../controller/authController.js');
const authenticate=require('../middleware/authMiddleware.js');

router.get('/',getLogin)
router.get('/login',getLogin)
router.get('/register',getRegister)
router.post('/register',register);
router.post('/login',login);
router.get('/logout',authenticate,logout)

module.exports=router;