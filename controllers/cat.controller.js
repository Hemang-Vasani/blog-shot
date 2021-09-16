const {catModel} = require("../models/cat.models");

const {subCatModel} =  require("../models/cat.models");
const userModel = require("../models/user.models");

const addCat = async (req, res) => {
    try {
        var cats = new catModel(req.body);
        console.log(req.file)
        if(req.file){
            cats.image = req.file.key
        }
        cats.save((err, docs) => {
            if (err) throw new Error(err);
            res.redirect('/cats')
            // res.send(docs)
        });
    } catch (error) {
        res.status(500).send("error occur at addDC: " + error.message);
    }
};

// FOR DISPLAYING ALL DATA OF DIET CATEGORY(DIETCMODEL)
const displayCatList = async (req, res) => {
    try {
        catModel.find({}, (err, docs) => {
            if (err) throw new Error(err);
            if (docs.length == 0) {
                res.render('cats', { cats: false });
            } else if (docs.length > 0) {
                res.render('cats', { cats: docs })

            } else {
                res.send({ ok: false, message: "SOMETHING WENT WRONG." })
            }
        });
    } catch (error) {
        res.status(500).send("error occur at displayBanner: " + error.message);
    }
};


const getAllCat = async (req, res) => {
    try {
        const user = await userModel.findOne({deviceId : req.user._id}).select(`category`)
        const cats = await catModel.find({})
        var match = []
    
        for (var i = 0; i < cats.length; i++) {
            matches = false
            for (var j = 0; j < user.category.length; j++) {
                // console.log(allCat[i].name)
                if (user)
                    if (cats[i].name === user.category[j]) {
                        match.push({ follower: cats[i].follower, created_date: cats[i].created_date, _id: cats[i]._id, name: cats[i].name, image: cats[i].image, status: true })
                        matches = true
                    }
            }
            if (!matches) match.push({ follower: cats[i].follower, created_date: cats[i].created_date, _id: cats[i]._id, name: cats[i].name, image: cats[i].image, status: false })
        }
        res.send(match)
    } catch (error) {
        res.send(error.message)
    }
}

const followCat = async (req, res) => {
    try {

        var isExist = false;
        var index;
        var userData = {}
        for (var key in req.body) {
            userData[key] = req.body[key]
        }
        const user = await userModel.findOne({ deviceId: req.user._id })
        // user.category = []
        // user.save()
        // res.send(user)
        console.log(user)
        const arr = []
        if (user) {
            for (let i = 0; i < user.category.length; i++) {
                if (user.category[i] === userData.cat) {
                    isExist = true;
                    index = i;
                }
            }
            if (isExist === true) {
                console.log("true" )
                user.category.splice(index, 1);
                await catModel.findOneAndUpdate({ name: { $in: userData.cat } }, { $inc: { follower: -1 } }, { new: true });
            } else {
                console.log("false" )

                user.category.push(userData.cat);
                await catModel.findOneAndUpdate({ name: { $in: userData.cat } }, { $inc: { follower: 1 } }, { new: true });
            }
            await user.save();
            for (j = 0; j < user.category.length; j++) {
                arr.push({ categoryname: user.category[j] })
            }
            res.send(arr);
        }

    } catch (error) {
        res.send(error.message)
    }
}

const searchUCat = async (req, res) => {
    // const user = await userModel.findById("60ace788086b12b3beee9d72")
    // const user = req.user
    const user = await userModel.findOne({ deviceId: req.user._id }).select(`category `)
    console.log(user.category)
    const userCat = user.category
    var regex = new RegExp(req.body["term"], 'i')
    console.log(regex)
    var catfilter = catModel.find({ name: regex }).sort({ "updated_at": -1 }).sort({ "created_at": -1 }).limit(20)
    catfilter.exec(function (err, data) {
        var result = []
        console.log("dat" + data)
        if (!err) {
            if (data && data.length && data.length > 0) {
                data.forEach(cat => {
                    userCat.forEach((u) => {
                        if (u == cat.name) {
                            console.log(cat)
                            let obj = {
                                id: cat._id,
                                name: cat.name,
                                image: cat.image,
                            }
                            result.push(obj)
                        }
                    })
                })
            }
            res.jsonp(result)
            console.log(data.length)

        }
    })
}

const searchPCat = (req, res) => {
    var regex = new RegExp(req.body["term"], 'i')
    console.log(regex)
    var catfilter = catModel.find({ name: regex }).sort({ "updated_at": -1 }).sort({ "created_at": -1 }).limit(20)
    catfilter.exec(function (err, data) {
        var result = []
        console.log("dat" + data)
        if (!err) {
            if (data && data.length && data.length > 0) {
                data.forEach(cat => {
                    console.log(cat)
                    let obj = {
                        id: cat._id,
                        name: cat.name,
                        image: cat.image,
                    }
                    result.push(obj)
                })
            }
            res.jsonp(result)
        }
    })
}

const followingCat = async (req, res)=>{
    try {
        const user = await userModel.findOne({deviceId : req.user._id}).select(`category`)
        const cats = await catModel.find({name : {$in : user.category}})
        res.send({cats : cats})
        // for (var i = 0; i < allCat.length; i++) {
        //     matches = false
        //     for (var j = 0; j < userCat.length; j++) {
        //         // console.log(allCat[i].name)
        //         if (user)
        //             if (allCat[i].name === userCat[j]) {
        //                 match.push({ follower: allCat[i].follower, created_date: allCat[i].created_date, _id: allCat[i]._id, name: allCat[i].name, image: allCat[i].image, status: true })
        //                 matches = true
        //             }
        //     }
        //     if (!matches) match.push({ follower: allCat[i].follower, created_date: allCat[i].created_date, _id: allCat[i]._id, name: allCat[i].name, image: allCat[i].image, status: false })
        // }
  
    } catch (error) {
     res.send(error.message)   
    }
}

const addSCat = async (req, res) => {
    try {
        let cats = new subCatModel(req.body);
        console.log(cats)
        cats.save((err, docs) => {
            if (err) throw new Error(err);
            res.redirect('/cats/displaySCatList')
            // res.send(docs)
        });
    } catch (error) {
        res.status(500).send("error occur at addDC: " + error.message);
    }
};

// FOR DISPLAYING ALL DATA OF DIET CATEGORY(DIETCMODEL)
const displaySCatList = async (req, res) => {
    try {
        subCatModel.find({}, (err, docs) => {
            if (err) throw new Error(err);
            if (docs.length == 0) {
                res.render('subCats', { cats: false });
            } else if (docs.length > 0) {
                res.render('subCats', { cats: docs })

            } else {
                res.send({ ok: false, message: "SOMETHING WENT WRONG." })
            }
        });
    } catch (error) {
        res.status(500).send("error occur at displayBanner: " + error.message);
    }
};


module.exports = {
    addCat,
    displayCatList,
    getAllCat,
    followCat,
    searchUCat,
    searchPCat,
    followingCat,
    addSCat,
    displaySCatList
}