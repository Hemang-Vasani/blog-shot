const express = require("express")
const adminUserRouter = express.Router()
const adminUserController = require("../controllers/adminUser.controller")


// #ADMIN SIDE
// adminUserRouter.get('/', userController.displayUser)
// adminUserRouter.post('/addUser', adminUserController.addUser)
adminUserRouter.post('/registerUser', adminUserController.registerUser)
adminUserRouter.post('/login', adminUserController.login)
adminUserRouter.get('/login', adminUserController.getLogin)

// #CLIENT SIDE



// catRouter.delete('/delTable', catController.delTable)
// // #CLIENT SIDE
// catRouter.post('/', catController.addRating)


module.exports = adminUserRouter