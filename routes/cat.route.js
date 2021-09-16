const express = require("express")
const catRouter = express.Router()
const catController = require("../controllers/cat.controller")
const auth = require("../validation/verifyToken")

const upload = require("../services/file-upload-cat");
const singleUpload = upload.single('image')

// #ADMIN SIDE
catRouter.get('/', catController.displayCatList)
catRouter.post('/',singleUpload, catController.addCat)
catRouter.get('/displaySCatList', catController.displaySCatList)
catRouter.post('/addSCat', catController.addSCat)

// #CLIENT SIDE
catRouter.get('/allCat',auth, catController.getAllCat)
catRouter.post('/followCat',auth, catController.followCat)



// #CLIENT SIDE
catRouter.post('/searchUcat',auth, catController.searchUCat)
catRouter.post('/searchPcat',auth, catController.searchPCat)
catRouter.get('/followingCat',auth, catController.followingCat)


module.exports = catRouter