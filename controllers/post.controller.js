const postModel = require('../models/post.models')
const { catModel } = require("../models/cat.models")
const { subCatModel } = require("../models/cat.models")

const adminpostModel = require("../models/adminUser.models")
const moment = require("moment");
const userModel = require('../models/user.models');
const { post } = require('../routes/user.route');

const disPost = async (req, res) => {
    try {
        const adminUser = req.session.adminUser
        console.log(adminUser)
        var posts = await postModel.find({ admin_user: adminUser._id }).sort({ _id: -1 });
        var Scats = await subCatModel.find({});
        var Mcats = await catModel.find({});
        if (posts.length == 0) {
            res.render('post', { posts: [], updatePost: "undefined", MCatList: Mcats, SCatList: Scats })
        } else if (posts.length > 0 && Mcats) {
            // console.log(blogs)
            res.render('post', { posts: posts, MCatList: Mcats, updatePost: "undefined", SCatList: Scats })
            // res.send(blogs)
        } else {
            res.send({ ok: false, message: "SOMETHING WENT WRONG." })
        }
    } catch (error) {
        res.status(500).send("error occur at displayBanner: " + error.message);
    }
};

const addPost = async (req, res) => {
    try {
        var updateId = req.body.updateId;
        const adminUser = req.session.adminUser
        // console.log("ids" + JSON.stringify(req.body.updateId))
        if (updateId == undefined || updateId === "") {
            // console.log("normal")
            var cdatetime = moment().format("YYYY-MM-DD HH:mm");
            // await postModel.updateMany({ schedule_time: { $lte: cdatetime } }, { visibility: true });
            var time;
            if (req.body.schedule_time && req.body.schedule_time > cdatetime) {
                var stime = req.body.schedule_time.split(/(-|\s|:)/g);
                time = '0 ' + stime[8] + ' ' + stime[6] + ' ' + stime[4] + ' ' + stime[2] + " *";
            } else {
                time = false;
            }
            var newpost = new postModel(req.body);
            const checkName = await postModel.findOne({ post_title: req.body.post_title }).select(`post_title`)
            if (checkName) return res.send("Add Uniqe Blog Name")

            var image_blog = '';
            if (req.file) {
                newpost.image = req.file.key
            }
            newpost.admin_user = adminUser
            // console.log(req.file, req.files)
            // if (req.files.length !== 0) {
            //     // console.log("req" + JSON.stringify(req.files))
            //     for (let i = 0; i < req.files.length; i++) {
            //         newpost.image.push(req.files[i].key)
            //     }
            //     // console.log(newpost)
            //     image_blog = req.files[0].location;
            // }
            console.log(newpost)
            newpost.save(async (err, docs) => {
                if (err) throw new Error(err);
                if (docs) {
                    console.log(docs)
                    const userUpdate = await adminpostModel.findOneAndUpdate({ _id: adminUser._id }, { $push: { posts: docs._id } }, { new: true })
                    console.log(userUpdate)
                    // var registrationTokens = [
                    //     'dpeCcPcVSKSaL_S60yjJYD:APA91bGYFPeUaAoouerhC3wAZLHlav3JlNp4x4PN_yeESa_RQNV6ucvkrkAze5fglwgH1MahxdtC7vxft51GiZ0D72iOFEYDaCPY1ZOrD8hi9l-OkkJj3-def1Bp45mFgleSERgTb2rn',
                    //     'fZ90CUr7RCGSUGcdJKaLKm:APA91bEf68KVyep8bqF9X4pUfkqP_fz7g34VWiZbmWKLiSCAjBiypVcYSIVEE6WbzqPlgMWEUIzlCIeHO3h2Jp-JuozHnM0BAH1mlKfFyh8Ui0k_4uHHDAEA35Ongu8PI3Pq35m1LxBj'
                    // ];
                    // var registrationTokens = [];
                    // const userToken = await postModel.aggregate([
                    //     {$match : {category : docs.post_category}},
                    //     {$group : {_id : null, array : {$push : "$notification_tokens.token"}}},
                    //     {$project :{ array : true , _id : false}} 
                    // ])
                    // registrationTokens = userToken
                    // let userToken = await postModel.find({ category: docs.post_category }).select('notification_tokens -_id')
                    // userToken.forEach((user) => {
                    //     registrationTokens.push(user.notification_tokens.token)
                    // })
                    // if (registrationTokens.length > 0) {

                    //     var message = {
                    //         notification: {
                    //             title: docs.blog_name,
                    //             image: image_blog,
                    //         },
                    //         data: {
                    //             score: '850',
                    //             time: '2:45',
                    //             Blog: docs.blog_link
                    //         },
                    //         tokens: registrationTokens
                    //     };
                    // console.log(docs)
                    if (time) {
                        schedule.scheduleJob(time, async () => {
                            await postModel.updateOne({ _id: docs._id }, { visibility: true }, { new: true }, (err, docs) => {
                            });
                            // const status = await notificationService(message, registrationTokens);
                            // notiServices.femaleNotification(message)

                        });
                    } else {
                        await postModel.updateOne({ _id: docs._id }, { visibility: true }, { new: true });
                        // const status = await notificationService(message, registrationTokens);
                        console.log('in notification')
                        // notiServices.femaleNotification(message)

                    }
                    // }
                    res.redirect("/post/admin");
                }
            });

        } else {
            var id = req.body.updateId;
            // console.log("update")
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                throw new Error("NOT VALID ID.");
            }
            var query = { _id: id };
            var newData = req.body;
            newData.image = []

            if (req.files.length !== 0) {
                // console.log("req" + JSON.stringify(req.files))
                for (let i = 0; i < req.files.length; i++) {
                    newData.image.push(req.files[i].key)
                }
                // console.log(newpost)
                image_blog = req.files[0].location;
            }
            let name = await postModel.findById(id);

            if (name.blog_title !== req.body.blog_title) {
                newData.slug = slugify(req.body.blog_title, { lower: true, strict: true });
                // newData.blog_link = `http://161.97.160.215:3000/blog/${req.body.post_category}/${newData.slug}`

            }
            // console.log("id is" + id)
            await postModel.findOneAndUpdate(query, newData, { new: true }, (err, docs) => {
                if (err) throw new Error(err)
                if (docs) {

                    res.redirect("/blog");
                } else if (!docs) {
                    res.json({ ok: false, message: "USER IS NOT VALID, CHECK FOR ID. " })
                } else {
                    res.send({ ok: false, message: "SOMETHING WENT WRONG." });
                }
            })
        }
    } catch (error) {
        res.status(500).send("error occur at addBlog: " + error.message);
    }
};

const timeline = async (req, res) => {
    try {
        // var allCat = await catModel.find({})

        var match = []
        var liked = []
        // var matches = false
        var userTag = []
        var user = await userModel.findOne({ deviceId: req.user._id }).select(`deviceId post_tag category liked saved`)

        if (user.post_tag) {
            var byPoint = user.post_tag.slice(0);
            byPoint.sort(function (a, b) {
                return b.count - a.count;
            });
            // console.log(byPoint.slice(0,3))
            userTag = byPoint.slice(0, 3).map(a => a.tag)
            // console.log(userTag)

        }

        console.log(user)
        var userCat = user.category
        var blogLike = user.liked
        const posts = await postModel.aggregate([
            { $match: { $or: [{ post_category: { $in: userCat } }, { post_subCategory: { $in: userTag } }] } },
            {
                $addFields: {
                    cats: {
                        $concatArrays: [[], userCat]
                    }
                }
            },
            {
                $addFields: {
                    liked: {
                        $concatArrays: [[], user.liked]
                    }
                }
            },
            {
                $addFields: {
                    saved: {
                        $concatArrays: [[], user.saved]
                    }
                }
            },
            // {
            //     $addFields: {
            //         tempCat: { $in: ["$post_category", "$cats"] }
            //     }
            // },

            {
                $addFields: {
                    "category": {
                        "$cond": {
                            // if: { $or: [{ "$gt": [{ "$size": "$likedBy" }, 0] }] }, dhrumeshbhai
                            if: { $in: ["$post_category", "$cats"] },
                            then: [{ "cat": "$post_category", "follower": 500, "status": false }],
                            else: [{ "cat": "$post_category", "follower": 500, "status": false }]
                        },

                    }
                }
            },
            // {
            //     $addFields : {
            //         "test" : {
            //          "$cond" : {
            //              if : {$eq : ["$post_category" , "$cats"]},
            //              then : 
            //          }
            //         }
            //     }
            // },
            // { $addFields: { user_id: { $toString: "$_id" } } },
            { $addFields: { "comment_count": { "$size": "$post_comment" } } },
            {
                $addFields: {
                    likeStatus: { $in: ["$_id", "$liked"] }
                }
            },
            {
                $addFields: {
                    saveStatus: { $in: ["$_id", "$saved"] }
                }
            },
            { $project: { user_id: 0, liked: 0, saved: 0, cats: 0, post_category: 0, post_comment: 0 } }

        ])
        // console.log("user" + user.category)
        // for (var i = 0; i < allCat.length; i++) {
        //     matches = false
        //     for (var j = 0; j < userCat.length; j++) {
        //         // console.log(allCat[i].name)
        //         if (user)
        //             if (allCat[i].name === userCat[j]) {
        //                 match.push({ follower: allCat[i].follower, createdAt: allCat[i].createdAt, _id: allCat[i]._id, name: allCat[i].name, image: allCat[i].image, status: true })
        //                 matches = true
        //             }
        //     }
        //     if (!matches) match.push({ follower: allCat[i].follower, createdAt: allCat[i].createdAt, _id: allCat[i]._id, name: allCat[i].name, image: allCat[i].image, status: false })
        // }
        // const posts = await postModel.find({ post_category: { $in: userCat } })
        // console.log(posts)
        // posts.forEach((elm) => {

        //     var bCat = elm.post_category
        //     match.forEach((e) => {
        //         if (bCat == e.name) {
        //             bCat = [{ cat: e.name, follower: e.follower, status: e.status }]
        //         }
        //         return bCat
        //     })
        //     elm.post_category = bCat
        //     var likeStatus = false

        //     user.liked.forEach((e)=>{
        //         console.log(e, elm._id)
        //         if(e == elm._id){
        //             likeStatus = true
        //         }else{
        //             likeStatus = false
        //         }
        //         return likeStatus
        //     })
        //     console.log(likeStatus)
        //     elm.likeStatus = likeStatus

        //     // var likeStatus = false
        //     // // console.log(elm.post_category)
        //     // if (blogLike.length > 0) {
        //     //     blogLike.forEach((blg) => {
        //     //         if (elm._id == blg.blogId) {
        //     //             if (blg.like == 1) {
        //     //                 // console.log(blg)
        //     //                 likeStatus = true
        //     //             } else {
        //     //                 likeStatus = false
        //     //             }
        //     //         }
        //     //         return likeStatus
        //     //     })
        //     // }
        //     // console.log("l status" + likeStatus)
        //     // elm.likeStatus = likeStatus
        //     // const imgArr = []
        //     // elm.image.forEach((img) => {
        //     //     imgArr.push({ imagename: img })
        //     // })
        //     // elm.image = imgArr
        // })
        res.send({ posts: posts })
    } catch (error) {
        res.send(error.message)
    }
}

const postDetail = async (req, res) => {
    try {
        const slug = req.params.slug
        const post = await postModel.findOne({ slug: slug })

    } catch (error) {
        res.send(error.message)
    }
}

const addLike = async (req, res) => {
    // var user = req.user;
    const user = await userModel.findOne({ deviceId: req.user._id })
    console.log(user)
    try {
        var id = req.body.pid;
        var update = req.body.update
        var likeID, query;
        (update == "true") ? (likeID = 1, query = { _id: req.body.pid, post_like: { $gte: 0 } }) : (likeID = -1, query = { _id: req.body.pid, post_like: { $gt: 0 } });
        //  var query = { _id: req.params.pid, post_like : { $gt: 0 } }
        var newData = { $inc: { post_like: likeID } };
        var userTag = []
        var docs = await postModel.findByIdAndUpdate(query, newData, { new: true });
        console.log(docs)

        console.log("called")
        console.log("b tag" + update)
        var index;
        var isExist = false;
        for (let i = 0; i < user.liked.length; i++) {
            // console.log(user.liked[i], userData.cat)
            if (user.liked[i] == id) {
                isExist = true;
                index = i;
                // return;
            }
        }
        if (docs) {
            if (update == "true") {
                console.log("true", user.liked)
                // if(isExist == false){
                user.liked.push(id)
                // }
                //     // console.log("tag" + user.post_tag)
                //     // user.post_tag = []
                docs.post_subCategory.forEach((elm) => {
                    var isExist = false
                    var index
                    for (let i = 0; i < user.post_tag.length; i++) {
                        // console.log(elm)
                        if (user.post_tag[i].tag == elm) {
                            isExist = true
                            index = i
                        }
                    }
                    if (!isExist) isExist = false
                    // console.log(isExist)
                    if (isExist === true) {
                        user.post_tag[index].count += 1
                    } else {
                        // console.log("npo tag")
                        user.post_tag.push({ tag: elm, count: 1 })
                    }
                })
            }
            if (update == "false") {
                console.log("false", user.liked, index)

                user.liked.splice(index, 1)

                //     // console.log("insde false")

                //     // console.log("b tag" + docs.post_subCategory)

                //     // console.log("tag" + user.post_tag)
                //     // user.post_tag = []
                docs.post_subCategory.forEach((elm) => {
                    var isExist = false
                    var index
                    for (let i = 0; i < user.post_tag.length; i++) {

                        if (user.post_tag[i].tag === elm) {
                            isExist = true
                            index = i
                        }
                    }
                    if (!isExist) isExist = false

                    if (isExist === true) {
                        user.post_tag[index].count += -1
                        if (user.post_tag[index].count == 0) {
                            user.post_tag.splice(index, 1)
                            // console.log("removed ")
                        }
                    } else {
                        user.post_tag.push({ tag: elm, count: 1 })
                    }
                })
            }
            await user.save()
            // console.log("tag" + user)
            res.json({ post_like: docs.post_like });
        } else if (!docs) {
            res.json({ ok: false, message: "USER IS NOT VALID, CHECK FOR ID. " })
        } else {
            res.send({ ok: false, message: "SOMETHING WENT WRONG." });
        }
    } catch (error) {
        res.send("error: " + error.message);
    }
}

const likedPost = async (req, res) => {
    try {
        const user = await userModel.findOne({ deviceId: req.user._id })
        const posts = await postModel.find({ _id: { $in: user.liked } })
        res.send(posts)
    } catch (error) {
        res.send(error.message)
    }
}

const addComment = async (req, res) => {
    try {
        const pId = req.body.pId
        // const user = req.user
        const user = await userModel.findOne({ deviceId: req.user._id })
        console.log(user.f_name, user.nickname)
        var name
        if (user.f_name !== undefined) {
            name = user.f_name
        } else {
            name = "unknown"
        }
        // console.log("user is"+user)
        const cmnt = {
            comment: req.body.comment,
            uId: user._id,
            u_name: name,
            u_image: user.user_image
        }
        if (req.body.comment == undefined) {
            res.send("can not post empty comment")
        }
        const addCmnt = await postModel.findOneAndUpdate({ _id: pId }, { $push: { 'post_comment': cmnt } }, { new: true })
        // console.log("cmnt" + addCmnt)
        res.send(addCmnt)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

const getComment = async (req, res) => {
    try {
        const pid = req.body.pId
        const comment = await postModel.findOne({ _id: pid }).select(`post_comment`)
        if (comment) {
            res.send(comment)
        }
        else {
            res.send('unable to find comment')
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

const addShare = async (req, res) => {
    // const user = req.user
    const user = await userModel.findOne({ deviceId: req.user._id })
    try {
        var id = req.body.pId;
        var newData = { $inc: { shareCount: 1 } };
        var docs = await postModel.findByIdAndUpdate(id, newData, { new: true });
        if (docs) {
            res.json({ shareCount: docs.shareCount });
        } else if (!docs) {
            res.json({ ok: false, message: "USER IS NOT VALID, CHECK FOR ID. " })
        } else {
            res.send({ ok: false, message: "SOMETHING WENT WRONG." });
        }
        // blogModel.findById({ _id: id }, (err, data) => {
        //     if (err) throw new Error(err)
        //     if (data) {
        //         // console.log(data)
        //         // console.log(user)
        //         user.addShare(data);
        //     }
        // })
    } catch (error) {
        res.send("error: " + error);
    }
}

const bgtime = async (req, res) => {
    var pId = req.body.pId
    var query = { id: req.body.pId }
    console.log("called")
    // var user = req.user;

    const docs = await postModel.findById(req.body.pId)
    if (docs) {
        var user = await userModel.findOne({ deviceId: req.user._id })
        // console.log(req.body)
        const avg = parseInt(req.body.timeSpent)
        var uTag = user.post_tag
        var isExist = false;
        var index;
        for (let i = 0; i < user.post_time.length; i++) {
            // console.log(user.liked[i], userData.cat)
            console.log(user.post_time[i], pId)
            if (user.post_time[i].pId == pId) {
                isExist = true;
                index = i;
                // return;
            }
        }
        if (isExist == false) {
            console.log("false")
            user.post_time.push({ pId: pId, time: avg })
            if (avg > 90000) {
                console.log("greateer than 90000")
                docs.post_subCategory.forEach((elm) => {
                    var Exist = false
                    var ind
                    for (let i = 0; i < uTag.length; i++) {
                        if (uTag[i].tag == elm) {
                            Exist = true
                            ind = i
                        }
                    }
                    if (!Exist) Exist = false

                    console.log("ecissty ----------------", Exist)
                    if (Exist === true) {
                        uTag[ind].count += 1
                    } else {
                        uTag.push({ tag: elm, count: 1 })
                    }
                })
            }
        } else {
            console.log("true")

            console.log(user.post_time[index].time)
            user.post_time[index].time += avg
            console.log(user.post_time[index].time)
            if (user.post_time[index].time > 90000) {
                console.log("greateer than 90000")

                docs.post_subCategory.forEach((elm) => {
                    var Exist = false
                    var ind
                    for (let i = 0; i < uTag.length; i++) {
                        if (uTag[i].tag == elm) {
                            Exist = true
                            ind = i
                        }
                    }
                    if (!Exist) Exist = false
                    console.log("ecissty ----------------", Exist, ind, uTag[ind])

                    if (Exist === true) {
                        console.log("yes it's true")
                        uTag[ind].count += 1
                    } else {
                        uTag.push({ tag: elm, count: 1 })
                    }

                })
            }
        }
        console.log("tag---------------", uTag)
        docs.post_avgTime += avg
        docs.post_avgTime /= docs.viewCount

        // user.post_tag = uTag
        // Math.round(docs.blog_avgTime)
        // await docs.addTime(req.body.timeSpent)
        // await user.addToBlog(docs, req.body.timeSpent);
        await user.save()
        await docs.save()
        res.send({ ok: true });
    } else {
        res.json({ ok: false, message: "UNABLE TO FIND THIS BLOG" })
    }

}

const savePost = async (req, res) => {
    try {
        var pId = req.body.pId
        console.log(req.user._id)
        var id = req.user._id
        const user = await userModel.findOne({ deviceId: id })
        var isExist = false;
        var index;

        if (user) {
            console.log(user)
            for (let i = 0; i < user.saved.length; i++) {
                if (user.saved[i] === pId) {
                    isExist = true;
                    index = i;
                }
            }
            if (isExist === true) {
                console.log("true")
                user.saved.splice(index, 1);
                await postModel.findOneAndUpdate({ _id: pId }, { $inc: { post_save: -1 } }, { new: true });
            } else {
                console.log("false")

                user.saved.push(pId);
                await postModel.findOneAndUpdate({ _id: pId }, { $inc: { post_save: 1 } }, { new: true });
            }
            await user.save();

            res.send({ status: true, saved: user.saved });
        }
    } catch (error) {
        res.send(error.message)
    }
}

const getSaved = async (req, res) => {
    try {
        const saved = await userModel.findOne({ deviceId: req.body._id }).select(`saved`)
        if (saved) {
            const posts = await postModel.find({ _id: { $in: saved.saved } })
            res.send({ status: true, posts: posts })
        } else {
            res.send({ status: false })
        }
    } catch (error) {
        res.send(error.message)
    }
}


const addHistory = async (req, res) => {
    try {
        const user = await userModel.findOne({ deviceId: req.user._id })
        const pId = req.body.pId
        if (user.history.length > 20) {
            for (let i = 0; i < user.history.length; i++) {
                if (pId == user.history[i]) {
                    user.history.splice(i, 1)
                }
            }
            user.history.pop()
            user.history.unshift(pId)
        } else {
            for (let i = 0; i < user.history.length; i++) {
                if (pId == user.history[i]) {
                    user.history.splice(i, 1)
                }
            }
            user.history.unshift(pId)
        }
        console.log({ status: true, message: "added to history suucessfull" })
        const saved = await user.save()
        res.send(user)
    } catch (error) {
        res.send(error.message)
    }
}

const getHistory = async (req, res) => {
    try {
        const user = await userModel.findOne({ deviceId: req.user._id }).select(`history`)

        if (user.history.length > 0) {
            const posts = await postModel.find({ _id: { $in: user.history } })
            res.send({ history: posts })
        } else {
            res.send({ history: [] })
        }
    } catch (error) {
        res.send(error.message)
    }
}

const trending = async (req, res) => {
    try {
        var user = await userModel.findOne({ deviceId: req.user._id }).select(`deviceId post_tag category liked saved`)
        const myDate = moment(new Date(), 'MM DD YYYY hh:mm:ss a').add(24, 'h').toDate()

        const posts = await postModel.aggregate([
            // { $match: { post_like: { $gt: 0 } } },
            {
                $addFields: {
                    liked: {
                        $concatArrays: [[], user.liked]
                    }
                }
            },
            {
                $addFields: {
                    saved: {
                        $concatArrays: [[], user.saved]
                    }
                }
            },
            {
                $addFields: {
                    likeW: {

                        $divide: [

                            {
                                $sum: {
                                    $add: [
                                        { "$multiply": [100, "$post_like"] },
                                        { "$multiply": [1000, "$shareCount"] },

                                    ]
                                }
                            }, { $round: { $divide: [{ $subtract: [myDate, "$createdAt"] }, 8640000] } }
                        ]

                    }
                },
            },
            {
                $addFields: {
                    likeStatus: { $in: ["$_id", "$liked"] }
                }
            },
            {
                $addFields: {
                    saveStatus: { $in: ["$_id", "$saved"] }
                }
            },
            {
                $sort: { likeW: -1 }
            },
            { $project: { likeW: 0 , liked : 0, saved : 0} }
        ])
        res.send(posts)
    } catch (error) {
        res.send(error.message)
    }
}

const catWisePost = async (req, res) => {
    try {
        const cat = req.body.cat
        if (!cat) return res.send({ status: false, message: "enter category" })
        const posts = await postModel.find({ $and: [{ post_category: cat }, { post_category: { "$nin": [""] } }] })
        res.send(posts)
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = {
    disPost,
    addPost,
    timeline,
    addLike,
    likedPost,
    addComment,
    getComment,
    addShare,
    bgtime,
    savePost,
    getSaved,
    addHistory,
    getHistory,
    trending,
    catWisePost
}