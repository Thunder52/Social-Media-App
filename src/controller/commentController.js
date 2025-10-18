const {Comment}=require('../models');
const Joi=require('joi');

const addComment=async(req,res)=>{
    try {
        const schema=Joi.object({
            postId:Joi.string().required(),
            comment:Joi.string().max(255).required()
        }) 
        const {error}=schema.validate(req.body);
        if(error){
            console.log(error);
            return res.redirect('/home');
        }
        const {comment,postId}=req.body;
        await Comment.create({comment,userId:req.id,postId:postId});
        return res.redirect('/home')
    } catch (error) {
        console.log(error);
        return res.status(500).send('something wents wrong!');
    }
}

module.exports={addComment}