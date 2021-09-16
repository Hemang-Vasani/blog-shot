const adminUserModel = require("../models/adminUser.models")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')


const registerUser = async (req, res) => {
    try {
        if (!req.body.email && !req.body.password) {
            return res.send({ status: false, message: "email or password is missing" })
        }
        const email = await adminUserModel.findOne({ email: req.body.email })
        if (email) return res.send({ status: false, message: "email alread exist" })

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt)

        const newuser = new adminUserModel(req.body)

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
        const user = await adminUserModel.findOne({ email: req.body.email }).select(`email password`)
        if (!user) return res.send('email does not exist')

        const passval = await bcrypt.compare(req.body.password, user.password)
        if (!passval) return res.send('Invalid password')

        req.session.adminUser = user
        res.redirect('/post/admin')

    } catch (error) {
        res.send(error.message)
    }
}


const getLogin = async (req, res)=>{
    try {
        res.render('adminLogin')
    } catch (error) {
        res.send(error.message)
    }
}

module.exports = {
    registerUser,
    login,
    getLogin
}