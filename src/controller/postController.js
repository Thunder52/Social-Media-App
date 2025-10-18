const Joi = require("joi");
const cloudinary = require("../config/cloudinary.js");
const { Op } = require("sequelize");
const { Post, User,Comment } = require("../models");

const getCreatePost = (req, res) => {
  res.render("createPost.ejs", { errors: req.flash("errors") });
};

const getHome = async (req, res) => {
  try {
    const id = req.id;
    const page = req.query.page || 1;
    const limit = 4;
    const skip = (page - 1) * limit;
    const posts = await Post.findAll({
      where: {
        [Op.or]: [{ isPrivate: false }, { userId: id }],
      },
      include: [ {model: User},{model:Comment,include:[{model:User,attributes:["fullName"]}]} ],
      limit: limit,
      offset: skip,
    });
    const plainPost = posts.map((post) => {
      const plain = post.get({ plain: true });
      return {
        ...plain,
        isCreater: plain.userId === id,
      };
    });
    const total = await Post.count();
    return res.render("home.ejs", {
      posts: plainPost,
      currPage: page,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("something wents wrong");
  }
};

const createPost = async (req, res) => {
  try {
    if (req.file.size / (1024 * 1024) > 5) {
      req.flash("errors", "file size too large upload file under 5mb");
      return res.redirect("back");
    }
    const schema = Joi.object({
      description: Joi.string().min(6).max(255).required(),
      isPrivate: Joi.boolean().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error);
      req.flash("errors", error.message);
      return res.redirect("/create");
    }
    const { description, isPrivate } = req.body;
    const uploadRes = await cloudinary.uploader.upload(req.file.path);
    await Post.create({
      image: uploadRes.secure_url,
      description,
      userId: req.id,
      isPrivate: isPrivate,
    });
    return res.redirect("/home");
  } catch (error) {
    console.log(error);
    req.flash("errors", "something wents wrong!");
    return res.redirect("/create");
  }
};

const getUpdate=async (req,res)=>{
  try {
    const {id}=req.params;
    const post=await Post.findByPk(id);
    return res.render('editPost.ejs',{post,errors:req.flash('errors')});
  } catch (error) {
    console.log(error);
    return res.send('something wents wrong');
  }
}

const updatePost = async (req, res) => {
  try {
    const {id}=req.params;
    if (req.file && req.file.size / (1024 * 1024) > 5) {
      req.flash("errors", "file size too large upload file under 5mb");
      return res.redirect("back");
    }
    const schema = Joi.object({
      description: Joi.string().min(6).max(255).required(),
      isPrivate: Joi.boolean().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error);
      req.flash("errors", error.message);
      return res.redirect("/update");
    }
    const { description, isPrivate } = req.body;
    const post=await Post.findByPk(id);
    if(req.file){
    const existingImage = post.image;
    const publicId = existingImage.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
    const uploadRes = await cloudinary.uploader.upload(req.file.path);
      await Post.update({
      description,
      image:uploadRes.secure_url,
      isPrivate:isPrivate,
    })
    return res.redirect("/home");
    }
    await Post.update({description,isPrivate})
    return res.redirect("/home");
  } catch (error) {
    console.log(error);
    req.flash("errors", "something wents wrong!");
    return res.redirect("/update");
  }
};

const deletePost=async (req,res)=>{
  try {
    const {id}=req.params;
    await Post.destroy({where:{id:id}});
    return res.redirect('/home');
  } catch (error) {
    console.log(error);
    return res.status(500).send('something wents wrong');
  }
}

module.exports = { getCreatePost, createPost, getHome, updatePost,deletePost,getUpdate};
