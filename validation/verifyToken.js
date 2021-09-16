const jwt = require("jsonwebtoken");


let auth = async (req, res , next)=>{
    try {
        
        const token = req.header('Authorization').replace('Bearer ', '');
        // console.log("token"+token)
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decoded)
        // const user = await userModel.findOne({ deviceId: decoded._id });
        req.user = decoded;
        console.log(req.user._id)
        next();
    } catch (error) {
        res.send("error occured during verifying token" + error.message)
    }
}

module.exports = auth;