const router=require('express').Router();
const {getLogin,getRegister,register,login}=require('../controller/authController.js');

router.get('/',getLogin)
router.get('/login',getLogin)
router.get('/register',getRegister)
router.post('/register',register);
router.post('/login',login);

module.exports=router;