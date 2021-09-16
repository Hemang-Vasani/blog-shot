const userModel = require('../models/user.models')
const postModel = require("../models/post.models")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const tokenModel = require("../models/token.models")
var smtpTransport = require('nodemailer-smtp-transport');
const { PI } = require('aws-sdk');
const { fstat } = require('fs');

const addUser = async (req, res) => {
    try {
        var newuser = await userModel.findOne({ deviceId: req.body.device_id });
        if (!newuser) {
            newuser = new userModel(req.body);
            console.log('inside if ##########################');
        }
        if (req.body.facebook_id) {
            newuser.facebook_id = req.body.facebook_id
        }
        if (req.body.google_id) {
            newuser.google_id = req.body.google_id
        }
        if(req.body.f_name){
            newuser.f_name = req.body.f_name
        }
        if(req.body.l_name){
            newuser.l_name = req.body.l_name
        }
        const saved = await newuser.save()
        if (saved) {
            const token = jwt.sign({ _id: saved.deviceId }, process.env.TOKEN_SECRET)
            console.log("new user added.");
            res.status(200).send({ status: true, message: "successfully register", token: token, docs: saved });
        } else {
            res.send({ status: false, message: "unable to save data" })
        }
    } catch (error) {
        res.send(error.message)
    }
}

const displayUser = async (req, res) => {
    try {
        const user = await userModel.find()
        res.send(user)
    } catch (error) {
        res.send(error.message)
    }
}

const registerUser = async (req, res) => {
    try {
        if (!req.body.email && !req.body.password) {
            return res.send({ status: false, message: "email or password is missing" })
        }
        const email = await userModel.findOne({ email: req.body.email })
        if (email) return res.send({ status: false, message: "email alread exist" })

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt)

        const newuser = new userModel(req.body)

        newuser.password = hashed

        const usersave = await newuser.save()
        if (usersave) {
            res.send({ status: true, message: "user successfully registered" })
        }
    } catch (error) {
        res.send(error.message)
    }
}

const login = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) return res.send('email does not exist')

        const passval = await bcrypt.compare(req.body.password, user.password)
        if (!passval) return res.send('Invalid password')

        // create and assign jwt token
        const token = jwt.sign({ _id: user.deviceId }, process.env.TOKEN_SECRET);
        res.status(200).send({ status: true, message: "successfully logged in", token: token });

    } catch (error) {
        res.send(error.message)
    }
}

const userProfile = async (req, res) => {
    try {
        const profile = await userModel.aggregate([
            { $match: { deviceId: req.user._id } },
            // {$project : {_id : 0, liked : {$size : "$liked"}}},
            { $group: { _id: { _id: "$_id", liked: { $sum: { $size: "$liked" } }, following: { $sum: { $size: "$category" } }, f_name: "$f_name", saved: "$saved", user_image: "$user_image" } } }
        ])
        const saved = await postModel.find({ _id: { $in: profile[0]._id.saved } })
        res.send({ profile: profile, saved: saved })
    } catch (error) {
        res.send(error.message)
    }
}



const forgetPass = async (req, res) => {
    try {
        const otp = Math.floor(Math.random() * 10000)
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.send("user does not exists")

        let token = await tokenModel.findOne({ userId: user._id });
        if (!token) {
            token = await new tokenModel({
                userId: user._id,
                token: otp,
            }).save();
        }

        // const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", otp);
        res.send({status : true, id : user._id});

    } catch (error) {
        res.send(error.message)
    }
}
// xsmwhhpjfpyukeai
const sendEmail = async (email, subject, text) => {
    try {
        console.log(email)
        const transporter = nodemailer.createTransport({
            // host: process.env.HOST,
            service: 'gmail',
            // port: 465,
            // ignoreTLS: false,
            // secure: false,
            auth: {
                user: 'kathiriyadhrumesh@gmail.com',
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: 'kathiriyadhrumesh@gmail.com',
            to: email,
            subject: subject,
            text: `${text}`,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

const checkMail = async (req, res) => {
    try {
        const otp = req.body.otp
        const id = req.body.id
        // const user = await userModel.findById(req.params.userId);
        // if (!user) return res.status(400).send("invalid link or expired");
        const token = await tokenModel.findOne({
            userId: id,
            token: otp,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        // const salt = await bcrypt.genSalt(10);
        // const hashed = await bcrypt.hash(req.body.password, salt)
        // user.password = hashed
        // await user.save();
        await token.delete();
        res.send({ userId: id, token: token.token });
    } catch (error) {
        res.send(error.message)
    }
}

const updatePass = async (req, res) => {
    try {
        const userId = req.body.userId
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt)
        const user = await userModel.findOneAndUpdate({ _id: userId }, { $set: { password: hashed } }, { new: true })
        res.send("password changed succesfully")
        // const user = await userModel.findById(req.params.userId);
        // if (!user) return res.status(400).send("invalid link or expired");

        // const token = await tokenModel.findOne({
        //     userId: user._id,
        //     token: req.params.token,
        // });
        // if (!token) return res.status(400).send("Invalid link or expired");


        // user.password = hashed
        // await user.save();
        // await token.delete();
        // res.send({ userId: user._id, token: token });
    } catch (error) {
        res.send(error.message)
    }
}

const chanegePass = async (req, res) => {
    try {
        const old_pass = req.body.old_pass
        const user = await userModel.findOne({ deviceId: req.user._id })
        if(!user) return res.send({status : false , message :"user is not valid"})
        
        const passVal = await bcrypt.compare(old_pass, user.password)
        if(!passVal) return res.send({status : false, message : "old password is not valid"})

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt)
        user.password = hashed
        await user.save()
        res.send("password changed sucessfully")
    } catch (error) {
        res.send(error.message)
    }
}


module.exports = {
    addUser,
    displayUser,
    registerUser,
    login,
    userProfile,
    forgetPass,
    checkMail,
    updatePass,
    chanegePass,
    
}