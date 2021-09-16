const express = require("express")
const userRouter = express.Router()
const userController = require("../controllers/user.controller")
const auth = require("../validation/verifyToken")

// #ADMIN SIDE
userRouter.get('/', userController.displayUser)


// #CLIENT SIDE
userRouter.post('/addUser', userController.addUser)
userRouter.post('/registerUser', userController.registerUser)
userRouter.post('/login', userController.login)
userRouter.get('/userProfile',auth,  userController.userProfile)
userRouter.post('/forgetPass',  userController.forgetPass)
userRouter.post('/password-reset',  userController.checkMail)
userRouter.post('/updatePass',  userController.updatePass)
userRouter.post('/chanegePass', auth, userController.chanegePass)



// catRouter.delete('/delTable', catController.delTable)
// // #CLIENT SIDE
// catRouter.post('/', catController.addRating)


module.exports = userRouter