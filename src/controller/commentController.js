const {Comment}=require('../models');
const Joi=require('joi');

const addComment=async(req,res)=>{
    try {
        const schema=Joi.object({
            postId:Joi.string().required(),
            comment:Joi.string().max(255).required()
        }) 
        const {value,error}=schema.validate(req.body);
        if(error){
            console.log(error);
            return res.redirect('/home');
        }
        const {comment,postId}=value;
        await Comment.create({comment,userId:req.id,postId:postId});
        return res.redirect('/home')
    } catch (error) {
        console.log(error);
        return res.status(500).send('something wents wrong!');
    }
}

const updateComment=async(req,res)=>{
    try {
        const schema=Joi.object({
            postId:Joi.string().required(),
            comment:Joi.string().max(255).required(),
        });
        const {value,error}=schema.validate(req.body);
        if(error){
            req.flash('errors',error.message);
            return res.redirect('/home');
        }
        const {postId,comment}=value;
        const {id}=req.params;
        const existingComment=await Comment.findByPk(id);
        if(!existingComment){
            req.flash('errors',"Comment not found!");
            return res.redirect('/home');
        }
        if(existingComment.userId!==req.id){
            req.flash('errors',"You are not authorized to update this comment!");
            return res.redirect('/home');
        }
        existingComment.comment=comment;
        await existingComment.save();
        return res.redirect('/home');
    } catch (error) {
        console.log(error);
        return res.status(500).send('something wents wrong!');
    }
}

const deleteComment=async(req,res)=>{
    try {
        const {id}=req.params;
        const existingComment=await Comment.findByPk(id);
        if(!existingComment){
            req.flash('errors',"Comment not found!");
            return res.redirect('/home');
        }
        if(existingComment.userId!==req.id){
            req.flash('errors',"You are not authorized to delete this comment!");
            return res.redirect('/home');
        }
        await existingComment.destroy();
        return res.redirect('/home');
    } catch (error) {
        console.log(error);
        return res.status(500).send('something wents wrong!');
    }
}

module.exports={addComment,updateComment,deleteComment};