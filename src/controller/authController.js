const db = require("../models/index.js");
const bcrypt =require('bcrypt')
const Joi=require('joi')
const jwt=require('jsonwebtoken')

const User=db.user;
const getLogin=(req,res)=>{
    res.render('login.ejs',{errors:req.flash('errors')});
}

const getRegister=(req,res)=>{
    res.render('register.ejs',{errors:req.flash('errors')});
}

const register=async(req,res)=>{
    try {
        const schema=Joi.object({
            fullName:Joi.string().min(6).max(255).required(),
            email:Joi.string().email().required(),
            password:Joi.string().min(6).max(100).required()
        });
        const {error}=schema.validate(req.body);
        if(error){
            req.flash("errors",error.message);
            return res.redirect(req.get('Referer') || '/register');
        }
        const {fullName,email,password}=req.body;
        const user=await User.findOne({where:{email:email}});
        if(user){
            req.flash("errors","User already exist!");
            return res.redirect(req.get('Referer') || '/register');
        }
        const newUser=await User.create({fullName,email,password});
        const token=jwt.sign({id:newUser.id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.cookie("token", token, { httpOnly: true });
        return res.redirect('/home');
    } catch (error) {
        console.log(error);
        req.flash('errors',"something wents wrong please try again letter!");
        return res.redirect(req.get('Referer') || '/register');
    }
}
const login=async(req,res)=>{
    try {
        const schema=Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().min(6).max(100).required()
        });
        const {error}=schema.validate(req.body);
        if(error){
            req.flash("errors",error.message);
            return res.redirect(req.get('Referer') || '/login');
        }
        const {email,password}=req.body;
        const user=await User.findOne({where:{email:email}});
        if(!user){
            req.flash("errors","User not found!");
            return res.redirect(req.get('Referer') || '/login');
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            req.flash('errors',"invlid credentials!");
            return res.redirect(req.get('Referer') || '/login');
        }
        const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.cookie("token", token, { httpOnly: true });
        return res.redirect('/home');
    } catch (error) {
        console.log(error);
        req.flash('errors',"something wents wrong please try again letter!");
        return res.redirect(req.get('Referer') || '/login');
    }
}

module.exports={getLogin,getRegister,register,login};
