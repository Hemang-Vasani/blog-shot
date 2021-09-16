const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const auth = require("../validation/verifyToken")

const upload = require("../services/file-upload-post");
const singleUpload = upload.single('image')


const { redirectUser } = require("../validation/admin-session")
const { redirectAdmin } = require("../validation/admin-session")

// #ADMIN SIDE
postRouter.get('/admin',redirectUser, postController.disPost)
postRouter.post('/admin',redirectUser,singleUpload, postController.addPost)


// #CLIENT SIDE
postRouter.get('/timeline',auth, postController.timeline)
postRouter.post('/addLike',auth, postController.addLike)
postRouter.get('/likedPost',auth, postController.likedPost)
postRouter.post('/addComment',auth, postController.addComment)
postRouter.post('/getComment',auth, postController.getComment)
postRouter.post('/addShare',auth, postController.addShare)
postRouter.post('/addTime',auth, postController.bgtime)
postRouter.post('/savePost',auth, postController.savePost)
postRouter.get('/getSaved',auth, postController.getSaved)
postRouter.post('/addHistory',auth, postController.addHistory)
postRouter.get('/getHistory',auth, postController.getHistory)
postRouter.get('/trending',auth, postController.trending)
postRouter.post('/catWisePost',auth, postController.catWisePost)







// postRouter.get('/allCat',auth, postController.getAllCat)
// postRouter.post('/followCat',auth, postController.followCat)



module.exports = postRouter