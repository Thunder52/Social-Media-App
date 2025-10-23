const { User } = require("../models");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/db.js");

const getLogin = (req, res) => {
  try {
    res.render("login.ejs", { errors: req.flash("errors") });
  } catch (error) {
    console.log(error);
    return res.status(500).send("something wents wrong!");
  }
};

const getRegister = (req, res) => {
  try {
    res.render("register.ejs", { errors: req.flash("errors") });
  } catch (error) {
    console.log(error);
    res.staus(500).send("something wents wrong!");
  }
};

const register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const schema = Joi.object({
      fullName: Joi.string().min(6).max(255).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(100).required(),
    });
    const { value, error } = schema.validate(req.body);
    if (error) {
      req.flash("errors", error.message);
      return res.redirect(req.get("Referer") || "/register");
    }
    const { fullName, email, password } = value;
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      req.flash("errors", "User already exist!");
      return res.redirect(req.get("Referer") || "/register");
    }

    const newUser = await User.create(
      { fullName, email, password },
      { transaction: t }
    );
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { httpOnly: true });
    await t.commit();
    return res.redirect("/home");
  } catch (error) {
    await t.rollback();
    console.log(error);
    req.flash("errors", "something wents wrong please try again letter!");
    return res.redirect(req.get("Referer") || "/register");
  }
};
const login = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(100).required(),
    });
    const { value, error } = schema.validate(req.body);
    if (error) {
      req.flash("errors", error.message);
      return res.redirect(req.get("Referer") || "/login");
    }
    const { email, password } = value;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash("errors", "User not found!");
      return res.redirect(req.get("Referer") || "/login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("errors", "invalid credentials!");
      return res.redirect(req.get("Referer") || "/login");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { httpOnly: true });
    return res.redirect("/home");
  } catch (error) {
    console.log(error);
    req.flash("errors", "something wents wrong please try again letter!");
    return res.redirect(req.get("Referer") || "/login");
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).send("something wents wrong!!");
  }
};

module.exports = { getLogin, getRegister, register, login, logout };
